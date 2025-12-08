import { Octokit } from '@octokit/rest'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { issueNumber, repoOwner, repoName, commentText } = body

  if (!commentText || !issueNumber) {
    throw createError({
      statusCode: 400,
      message: 'Comment text and issue number are required'
    })
  }

  // 使用用户自己的 GitHub token
  const token = getCookie(event, 'github_token')
  const githubUser = getCookie(event, 'github_username')

  if (!token || !githubUser) {
    throw createError({
      statusCode: 401,
      message: 'Please login with GitHub first'
    })
  }

  const octokit = new Octokit({ auth: token })

  try {
    const response = await octokit.issues.createComment({
      owner: repoOwner || config.public.repoOwner,
      repo: repoName || config.public.repoName,
      issue_number: parseInt(issueNumber),
      body: commentText
    })

    return response.data
  } catch (error: any) {
    console.error('Error details:', error.response?.data)
    throw createError({
      statusCode: error.status || 500,
      message: error.response?.data?.message || error.message || 'Error posting comment to GitHub'
    })
  }
})
