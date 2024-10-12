import { H3Event } from 'h3'
import { Octokit } from '@octokit/rest'

export async function getGitHubRepoInfo(event: H3Event, owner: string, repo: string) {
  const config = useRuntimeConfig()
  var token = getCookie(event, 'github_token')
  if (!token) {
    token = config.private.githubToken
  }
  // console.log("token: ", token)
  const octokit = new Octokit({ auth: token })

  try {
    const { data: githubRepo, headers } = await octokit.repos.get({ owner, repo })
    // console.log(headers)

    return {
      repo_id: githubRepo.id,
      repo_owner: owner,
      repo_name: repo,
      repo_description: githubRepo.description,
      stars_count: githubRepo.stargazers_count,
      forks_count: githubRepo.forks_count,
      updated_at: new Date().toISOString(),
      repo_detail: githubRepo
    }
  } catch (error) {
    console.error('GitHub API error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch repo info from GitHub' })
  }
}