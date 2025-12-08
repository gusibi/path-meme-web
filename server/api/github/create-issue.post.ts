import { H3Event } from 'h3'
import { Octokit } from '@octokit/rest'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  
  const { title, content, labels } = body
  
  console.log('[create-issue] Request received:', { title, hasContent: !!content, labels })
  
  if (!content) {
    throw createError({ statusCode: 400, statusMessage: 'Content is required' })
  }

  // 检查用户是否有发布权限
  const allowedPublisherId = config.allowedPublisherId
  console.log('[create-issue] Allowed publisher ID from config:', allowedPublisherId)
  
  if (!allowedPublisherId) {
    console.log('[create-issue] ERROR: ALLOWED_PUBLISHER_ID not configured')
    throw createError({ statusCode: 403, statusMessage: 'Publishing is not configured' })
  }

  try {
    const client = await serverSupabaseClient(event)
    const { data: { user }, error: userError } = await client.auth.getUser()
    
    console.log('[create-issue] Current user:', user ? { id: user.id, email: user.email } : null)
    console.log('[create-issue] User error:', userError)
    
    if (!user) {
      console.log('[create-issue] ERROR: No user found')
      throw createError({ statusCode: 401, statusMessage: 'Please login first' })
    }

    console.log('[create-issue] Comparing user IDs:')
    console.log('[create-issue]   - Current user ID:', user.id)
    console.log('[create-issue]   - Allowed ID:     ', allowedPublisherId)
    console.log('[create-issue]   - Match:', user.id === allowedPublisherId)

    if (user.id !== allowedPublisherId) {
      console.log('[create-issue] ERROR: User not authorized')
      throw createError({ statusCode: 403, statusMessage: `You are not authorized to publish. Your ID: ${user.id}` })
    }
    
    console.log('[create-issue] User authorized!')
  } catch (error: any) {
    console.log('[create-issue] Auth error:', error)
    if (error.statusCode) throw error
    throw createError({ statusCode: 401, statusMessage: 'Please login first' })
  }

  // 使用服务端配置的 token（有仓库写入权限）
  const token = config.private.githubToken
  console.log('[create-issue] GitHub token configured:', !!token, token ? `(${token.substring(0, 10)}...)` : '')
  
  if (!token) {
    console.log('[create-issue] ERROR: GitHub token not configured')
    throw createError({ statusCode: 500, statusMessage: 'GitHub token not configured on server' })
  }

  const octokit = new Octokit({ auth: token })
  
  const repoOwner = config.public.repoOwner
  const repoName = config.public.repoName
  
  console.log('[create-issue] Creating issue in:', `${repoOwner}/${repoName}`)

  try {
    const { data: issue } = await octokit.issues.create({
      owner: repoOwner,
      repo: repoName,
      title: title,
      body: content,
      labels: labels || []
    })

    console.log('[create-issue] Issue created successfully:', issue.number)

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
    console.error('[create-issue] GitHub API error:', {
      status: error.status,
      message: error.message,
      response: error.response?.data
    })
    throw createError({ 
      statusCode: error.status || 500, 
      statusMessage: error.message || 'Failed to create issue on GitHub' 
    })
  }
})
