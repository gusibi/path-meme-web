// server/api/repo/[repo_owner]/[repo_name]/issues/[id].ts

import { defineEventHandler, getCookie, createError } from 'h3'
import { useRuntimeConfig } from '#imports'
import { Octokit } from '@octokit/rest'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const { repo_owner, repo_name, id } = event.context.params

    let token = getCookie(event, 'github_token')
    if (!token) {
        token = config.private.githubToken
    }

    // console.log("token: ", token)
    const octokit = new Octokit({
        auth: token
    })

    try {
        const { data: issue } = await octokit.issues.get({
            owner: repo_owner,
            repo: repo_name,
            issue_number: parseInt(id)
        })

        // 获取评论
        const { data: comments } = await octokit.issues.listComments({
            owner: repo_owner,
            repo: repo_name,
            issue_number: parseInt(id)
        })

        return {
            number: issue.number,
            title: issue.title,
            body: issue.body,
            created_at: issue.created_at,
            updated_at: issue.updated_at,
            author: issue.user.login,
            labels: issue.labels,
            github_url: issue.html_url,
            repo_url: `/repo/${repo_owner}/${repo_name}`,
            reactions: issue.reactions,
            comments: comments,
        }
    } catch (error) {
        console.error('Error fetching issue from GitHub:', error)
        throw createError({
            statusCode: error.status || 500,
            statusMessage: error.message || 'Internal Server Error',
            message: `Failed to fetch issue with id ${id}`
        })
    }
})