import { H3Event } from 'h3'
import { Octokit } from '@octokit/rest'

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  
  const { title, content, labels } = body
  
  if (!content) {
    throw createError({ statusCode: 400, statusMessage: 'Content is required' })
  }

  // 优先使用用户的 token，否则使用配置的 token
  let token = getCookie(event, 'github_token')
  if (!token) {
    token = config.private.githubToken
  }
  
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'GitHub token not configured' })
  }

  const octokit = new Octokit({ auth: token })
  
  const repoOwner = config.public.repoOwner
  const repoName = config.public.repoName

  try {
    const { data: issue } = await octokit.issues.create({
      owner: repoOwner,
      repo: repoName,
      title: title,
      body: content,
      labels: labels || []
    })

    return {
      success: true,
      issue: {
        number: issue.number,
        title: issue.title,
        html_url: issue.html_url,
        created_at: issue.created_at
      }
    }
  } catch (error: any) {
    console.error('GitHub API error:', error)
    throw createError({ 
      statusCode: error.status || 500, 
      statusMessage: error.message || 'Failed to create issue on GitHub' 
    })
  }
})
