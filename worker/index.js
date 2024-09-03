export default {
    async fetch(request, env, ctx) {
        // 处理 CORS 预检请求
        if (request.method === "OPTIONS") {
            return handleCORS();
        }

        const url = new URL(request.url);

        if (url.pathname === '/api/blog-posts') {
            return await handleBlogPosts(request, env);
        } else {
            return new Response('Not Found', { status: 404 });
        }
    }
};

function handleCORS() {
    return new Response(null, {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}

async function handleBlogPosts(request, env) {
    const GITHUB_TOKEN = env.GITHUB_TOKEN; // 替换为你的 GitHub 个人访问令牌
    const owner = env.GITHUB_OWNER;
    const repo = env.GITHUB_REPO;
    console.log(GITHUB_TOKEN, owner, repo)
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