// server/api/repo/[repo_owner]/[repo_name]/blog-posts.ts

import { defineEventHandler } from 'h3'
import { getGitHubRepoInfo } from '../../../github/repos'
import { getIssuesList } from '../../../github/issues'
import { getRepoById, updateOrCreateRepo } from '../../../repos'


export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const perPage = parseInt(query.perPage as string) || 20
    const { repo_owner, repo_name } = event.context.params
    const tag = query.tag as string

    try {
        let repoData
        try {
            // 尝试从 /api/repos/list 获取数据
            repoData = await getRepoById(event, `${repo_owner}/${repo_name}`)
        } catch (error) {
            console.error('Failed to fetch repos from DB, errpr: ', error)
        }

        const now = new Date()
        const shouldFetchFromGitHub = !repoData ||
            (now.getTime() - new Date(repoData.updated_at).getTime() > 3600000) // 1 hour in milliseconds

        // console.log("update time,", repoData)
        // console.log("shouldFetchFromGitHub", shouldFetchFromGitHub, now.getTime(), new Date(repoData.updated_at).getTime())

        if (shouldFetchFromGitHub) {
            try {
                const githubRepoInfo = await getGitHubRepoInfo(event, repo_owner, repo_name)

                // console.log("githubRepoInfo, ", githubRepoInfo)
                try {
                    // 更新或插入数据库
                    repoData = await updateOrCreateRepo(event, githubRepoInfo, repoData)
                } catch (error) {
                    console.error('Failed to fetch repos from DB, errpr: ', error)
                }
            } catch (error) {
                console.error('Failed to fetch or update repo info:', error)
            }
        }

        const { issues, headers } = await getIssuesList(event, repo_owner, repo_name, tag, perPage, page)
        const totalItems = getTotalPages(headers, page) * perPage
        // console.log("totalItems: ", totalItems, page, perPage)
        // console.log("repoData: ", repoData)

        return {
            repo: repoData,
            blogPosts: issues,
            pagination: {
                currentPage: page,
                totalItems: totalItems,
                perPage: perPage
            }

        }
    } catch (error) {
        console.error('Error in blog-posts:', error)
        throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
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