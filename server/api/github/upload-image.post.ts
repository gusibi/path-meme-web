import { H3Event } from 'h3'
import { Octokit } from '@octokit/rest'

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  
  const { filename, content } = body // content is base64 encoded
  
  if (!filename || !content) {
    throw createError({ statusCode: 400, statusMessage: 'Filename and content are required' })
  }

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
  
  // Generate unique filename with timestamp
  const timestamp = Date.now()
  const ext = filename.split('.').pop() || 'png'
  const uniqueFilename = `images/${timestamp}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  try {
    // Upload file to GitHub repo
    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner: repoOwner,
      repo: repoName,
      path: uniqueFilename,
      message: `Upload image: ${filename}`,
      content: content, // Already base64 encoded
      branch: 'main'
    })

    // Return the raw GitHub URL for the image
    const imageUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${uniqueFilename}`

    return {
      success: true,
      url: imageUrl,
      path: uniqueFilename
    }
  } catch (error: any) {
    console.error('GitHub upload error:', error)
    throw createError({ 
      statusCode: error.status || 500, 
      statusMessage: error.message || 'Failed to upload image to GitHub' 
    })
  }
})
