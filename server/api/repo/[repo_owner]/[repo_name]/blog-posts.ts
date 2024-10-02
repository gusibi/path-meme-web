// server/api/repo/[repo_owner]/[repo_name]/blog-posts.ts

import { defineEventHandler } from 'h3'
import { Octokit } from '@octokit/rest'

export default defineEventHandler(async (event) => {
    const { repo_owner, repo_name } = event.context.params
    const query = getQuery(event)
    const tag = query.tag as string

    // console.log("github issus: ", repo_owner, repo_name, tag)
    var token = getCookie(event, 'github_token')

    const config = useRuntimeConfig()
    if (!token) {
        token = config.private.githubToken
    }
    // console.log("github token: ", token)
    const octokit = new Octokit({
        auth: token
    })

    try {
        // 获取仓库信息
        const { data: repoData } = await octokit.repos.get({
            owner: repo_owner,
            repo: repo_name,
        })

        var req_data = {
            owner: repo_owner,
            repo: repo_name,
            state: 'open', // 只获取开放的 issues
            sort: 'created',
            direction: 'desc',
            per_page: 10 // 限制返回的数量，你可以根据需要调整
        }
        req_data.labels = tag

        // 获取仓库的 issues 列表
        const { data: issues } = await octokit.issues.listForRepo(req_data)

        return {
            repo: {
                name: repoData.name,
                description: repoData.description,
                stars: repoData.stargazers_count,
                forks: repoData.forks_count,
            },
            blogPosts: issues.map(issue => ({
                number: issue.number,
                title: issue.title,
                body: issue.body,
                created_at: issue.created_at,
                labels: issue.labels,
                reactions: issue.reactions,
                comments: issue.comments,
                html_url: `/repo/${repo_owner}/${repo_name}/blog/${issue.number}`,
                github_url: issue.html_url,
                updated_at: issue.updated_at,
                author: issue.user.login,
                repo_url: `/repo/${repo_owner}/${repo_name}`,
                url: issue.html_url
            }))
        }
    } catch (error) {
        console.error('Error fetching data from GitHub:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error fetching data from GitHub'
        })
    }
})