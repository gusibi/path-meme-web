// server/api/repo/[repo_owner]/[repo_name]/blog-posts.ts

import { defineEventHandler } from 'h3'
import { Octokit } from '@octokit/rest'

export default defineEventHandler(async (event) => {
    const { repo_owner, repo_name } = event.context.params
    const query = getQuery(event)
    const tag = query.tag as string
    const page = parseInt(query.page as string) || 1
    const perPage = parseInt(query.perPage as string) || 20

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
            // state: 'open', // 只获取开放的 issues
            sort: 'created',
            direction: 'desc',
            per_page: perPage,// 限制返回的数量，你可以根据需要调整
            page: page,
            labels: tag
        }
        req_data.labels = tag

        // 获取仓库的 issues 列表
        const { data: issues, headers } = await octokit.issues.listForRepo(req_data)
        // console.log("issues: ", headers)
        const totalItems = getTotalPages(headers, page) * perPage

        // console.log("query:", query, "page:", page, "perPage: ", perPage, "total: ", totalItems, repo_owner, repo_name)
        // Get total count of issues
        // console.log("total: ", totalItems)
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
            })),
            pagination: {
                currentPage: page,
                totalItems: totalItems,
                perPage: perPage
            }
        }
    } catch (error) {
        console.error('Error fetching data from GitHub:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Error fetching data from GitHub'
        })
    }
})

function getTotalPages(headers: Record<string, any>, currentPage: number): number {
    if (!headers['link']) {
        return 1;
    }
    // console.log(headers['link'])

    let totalPage = 1
    const links = headers['link'].split(',');
    for (const link of links) {
        const match = link.match(/&page=(\d+)>; rel="last"/);
        if (match) {
            totalPage = parseInt(match[1], 10);
        }
    }

    if (currentPage > totalPage) {
        totalPage = currentPage
    }
    return totalPage;
}