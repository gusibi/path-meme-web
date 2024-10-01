import { Octokit } from '@octokit/rest'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody(event)
    const { issueNumber, commentText } = body

    const token = getCookie(event, 'github_token')
    const githubUser = getCookie(event, 'github_username')
    // console.log("github user:", githubUser, "repo:", config.public.repoName, "token:", token)

    if (!token) {
        throw createError({
            statusCode: 401,
            message: 'GitHub token not found'
        })
    }

    const octokit = new Octokit({ auth: token })
    // console.log('API call parameters:', {
    //     owner: githubUser,
    //     repo: config.public.repoName,
    //     issue_number: parseInt(issueNumber),
    //     body: commentText
    // });
    try {
        // 首先尝试获取用户信息来验证 token
        const { data: user } = await octokit.users.getAuthenticated();
        // console.log('Authenticated user:', user.login);
        const { data: rateLimit } = await octokit.rateLimit.get();
        // console.log('API Rate Limit:', rateLimit.rate);

        if (rateLimit.rate.remaining === 0) {
            throw createError({
                statusCode: 429,
                message: 'GitHub API rate limit exceeded'
            })
        }
        const response = await octokit.issues.createComment({
            owner: githubUser, // 使用配置中的仓库所有者
            repo: config.public.repoName,   // 使用配置中的仓库名称
            issue_number: parseInt(issueNumber), // 确保 issue_number 是整数
            body: commentText
        })

        return response.data
    } catch (error) {
        console.error('Error details:', error.response?.data);
        throw createError({
            statusCode: error.status || 500,
            message: error.message || 'Error posting comment to GitHub'
        })
    }
})