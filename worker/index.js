export default {
    async fetch(request, env, ctx) {
        return await handleRequest(request, env);
    }
};

async function handleRequest(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.split('/').filter(Boolean);
    const query = url.searchParams;

    try {
        if (path.length === 2 && path[0] === 'api' && path[1] === 'blog-posts' && query.has('tag')) {
            const tag = query.get('tag');
            return await fetchBlogPostsByTag(env, tag);
        } else if (path.length === 2 && path[0] === 'api' && path[1] === 'blog-posts') {
            return await fetchBlogPosts(env);
        } else if (path.length === 3 && path[0] === 'api' && path[1] === 'blog-posts') {
            const postId = path[2];
            return await fetchBlogPostWithComments(env, postId);
        } else {
            return new Response('Not Found', { status: 404 });
        }
    } catch (error) {
        return new Response(`Error: ${error.message}`, {
            status: 500,
            headers: {
                'content-type': 'text/plain',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

function handleCORS() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}

async function fetchBlogPosts(env) {
    const GITHUB_TOKEN = env.GITHUB_TOKEN; // 替换为你的 GitHub 个人访问令牌
    const owner = env.GITHUB_OWNER;
    const repo = env.GITHUB_REPO;
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Cloudflare Worker'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            return new Response(`GitHub API request failed with status ${response.status}: ${errorText}`, {
                status: response.status,
                headers: corsHeaders()
            });
        }

        const issues = await response.json();
        const blogPosts = issues.map(issue => ({
            number: issue.number,
            title: issue.title,
            body: issue.body,
            created_at: issue.created_at,
            labels: issue.labels,
            reactions: issue.reactions,
            comments: issue.comments,
            html_url: issue.html_url
        }));

        return new Response(JSON.stringify(blogPosts), {
            headers: corsHeaders()
        });
    } catch (error) {
        return new Response(`Error: ${error.message}`, {
            status: 500,
            headers: corsHeaders()
        });
    }
}

function corsHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
    };
}

async function fetchBlogPostWithComments(env, postId) {
    const GITHUB_TOKEN = env.GITHUB_TOKEN; // 替换为你的 GitHub 个人访问令牌
    const owner = env.GITHUB_OWNER;
    const repo = env.GITHUB_REPO;
    const [postResponse, commentsResponse] = await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${postId}`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Cloudflare Worker'
            }
        }),
        fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${postId}/comments`, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Cloudflare Worker'
            }
        })
    ]);

    if (!postResponse.ok || !commentsResponse.ok) {
        throw new Error(`GitHub API request failed`);
    }

    const issue = await postResponse.json();
    const comments = await commentsResponse.json();

    const blogPost = {
        number: issue.number,
        title: issue.title,
        body: issue.body,
        created_at: issue.created_at,
        labels: issue.labels,
        reactions: issue.reactions,
        comments: comments,
        html_url: issue.html_url
    };

    return new Response(JSON.stringify(blogPost), {
        headers: {
            'content-type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}

async function fetchBlogPostsByTag(env, tag) {
    const GITHUB_TOKEN = env.GITHUB_TOKEN; // 替换为你的 GitHub 个人访问令牌
    const owner = env.GITHUB_OWNER;
    const repo = env.GITHUB_REPO;
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Cloudflare Worker'
        }
    });

    if (!response.ok) {
        throw new Error(`GitHub API request failed with status ${response.status}`);
    }

    const issues = await response.json();
    const blogPosts = issues.filter(issue => issue.labels.some(label => label.name === tag)).map(issue => ({
        number: issue.number,
        title: issue.title,
        body: issue.body,
        created_at: issue.created_at,
        labels: issue.labels,
        reactions: issue.reactions,
        comments: issue.comments,
        html_url: issue.html_url
    }));

    return new Response(JSON.stringify(blogPosts), {
        headers: corsHeaders()
    });
}