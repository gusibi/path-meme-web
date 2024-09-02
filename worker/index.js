export default {
    async fetch(request, env, ctx) {
        return await handleRequest(request);
    }
};

async function handleRequest(request) {
    const GITHUB_TOKEN = ''; // 替换为你的 GitHub 个人访问令牌

    try {
        const response = await fetch('https://api.github.com/repos/gusibi/path-meme-db/issues', {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        // 检查响应是否成功
        if (!response.ok) {
            return new Response(`GitHub API request failed with status ${response.status}`, {
                status: response.status,
                headers: { 'content-type': 'text/plain' }
            });
        }

        const issues = await response.json();
        const blogPosts = issues.map(issue => ({
            title: issue.title,
            body: issue.body,
            created_at: issue.created_at
        }));

        return new Response(JSON.stringify(blogPosts), {
            headers: { 'content-type': 'application/json' }
        });
    } catch (error) {
        return new Response(`Error: ${error.message}`, {
            status: 500,
            headers: { 'content-type': 'text/plain' }
        });
    }
}