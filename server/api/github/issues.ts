import { H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'
import { Octokit } from '@octokit/rest'

export async function getIssuesList(event: H3Event, repo_owner: string, repo_name: string, labels: string, perPage: number, page: number) {
  const config = useRuntimeConfig()
  var token = getCookie(event, 'github_token')
  if (!token) {
    token = config.private.githubToken
  }
  const octokit = new Octokit({ auth: token })
  var req_data = {
    owner: repo_owner,
    repo: repo_name,
    // state: 'open', // 只获取开放的 issues
    sort: 'created',
    direction: 'desc',
    per_page: perPage,// 限制返回的数量，你可以根据需要调整
    page: page,
    labels: labels
  }
  req_data.labels = labels
  // console.log("req: ", req_data)

  try {

    const { data: issues, headers } = await octokit.issues.listForRepo(req_data)

    const formattedIssues = issues.map(issue => ({
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

    return { issues: formattedIssues, headers }
  } catch (error) {
    console.error('GitHub API error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch issues from GitHub' })
  }
}

export async function getRepoLabels(event: H3Event, repo_owner: string, repo_name: string) {
  const config = useRuntimeConfig()
  var token = getCookie(event, 'github_token')
  if (!token) {
    token = config.private.githubToken
  }
  const octokit = new Octokit({ auth: token })

  try {
    let allLabels: any[] = []
    let page = 1
    let hasNextPage = true

    while (hasNextPage) {
      const { data: labels, headers } = await octokit.issues.listLabelsForRepo({
        owner: repo_owner,
        repo: repo_name,
        per_page: 100,
        page: page
      })

      allLabels = allLabels.concat(labels)

      // Check if there's a next page
      const linkHeader = headers.link
      hasNextPage = linkHeader && linkHeader.includes('rel="next"')
      page++
    }

    // console.log("data: ", allLabels, allLabels.length)

    const formattedLabels = allLabels.map(label => ({
      id: label.id,
      name: label.name,
      description: label.description,
      color: label.color
    }))

    return formattedLabels
  } catch (error) {
    console.error('GitHub API error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch labels from GitHub' })
  }
}