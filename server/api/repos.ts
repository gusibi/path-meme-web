import { serverSupabaseClient } from '#supabase/server'
import { checkAuth } from '~/utils/auth'
import { H3Event } from 'h3'
interface RepoData {
  name: string;
  description: string;
  stars: number;
  issues: number;
  forks: number;
  labels: Array<{
    name: string,
    description: string,
    color: string
  }>;
  owner_name: string;
  created_at: string;
  updated_at: string;
}

interface RepoInfoTab {
  // id: number;
  repo_id: string;
  repo_owner: string;
  repo_name: string;
  is_show: Boolean;
  rank_score: number,
  created_at: string;
  updated_at: string;
  repo_detail: object;
}

// 列表查询函数
export async function getReposList(event: H3Event) {
  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from('repo_info_tab')
    .select('*')
    .order('rank_score', { ascending: false })

  if (error) throw createError({ statusCode: 400, statusMessage: error.message })
  const formattedData: RepoData[] = data.map(repo => ({
    name: repo.repo_name || '',
    description: repo.repo_detail.description || '',
    stars: repo.repo_detail.stars || 0,
    forks: repo.repo_detail.forks || 0,
    owner_name: repo.repo_owner || '',
    updated_at: repo.updated_at || new Date().toISOString()
  }))

  return formattedData
}

// 按 repo id 查询函数
export async function getRepoById(event: H3Event, id: string) {
  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from('repo_info_tab')
    .select('*')
    .eq('repo_id', id)
    .single()

  if (error) throw createError({ statusCode: 400, statusMessage: error.message })
  const formattedData: RepoData = {
    name: data.repo_name || '',
    description: data.repo_detail.description || '',
    stars: data.repo_detail.stars || 0,
    issues: data.repo_detail.issues || 0,
    forks: data.repo_detail.forks || 0,
    labels: data.repo_detail.labels || [],
    owner_name: data.repo_owner || '',
    created_at: data.created_at,
    updated_at: data.updated_at
  }
  return formattedData
}

// repo 更新函数
export async function updateRepo(event: H3Event, id: string, updateData: any) {
  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from('repos')
    .update(updateData)
    .eq('id', id)
    .select()

  if (error) throw createError({ statusCode: 400, statusMessage: error.message })
  return data
}

// repo 创建函数
export async function createRepo(event: H3Event, repoData: any) {
  const client = await serverSupabaseClient(event)
  const { data, error } = await client
    .from('repos')
    .insert(repoData)
    .select()

  if (error) throw createError({ statusCode: 400, statusMessage: error.message })
  return data
}

// repo update or create
export async function updateOrCreateRepo(event: H3Event, githubRepoData: any, githubRepoLabels: any, repoData: any) {
  const client = await serverSupabaseClient(event)
  // console.log("repoData: ", repoData)
  const repoTab: RepoInfoTab = {
    repo_id: `${githubRepoData.repo_owner}/${githubRepoData.repo_name}`,
    repo_owner: githubRepoData.repo_owner,
    repo_name: githubRepoData.repo_name,
    repo_detail: {
      "stars": githubRepoData.stars_count,
      "forks": githubRepoData.forks_count,
      "issues": githubRepoData.repo_detail.open_issues,
      "description": githubRepoData.repo_description,
      "labels": githubRepoLabels,
    },
    rank_score: githubRepoData.stars_count + githubRepoData.forks_count,
    is_show: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  if (!!repoData && repoData.created_at) {
    repoTab.is_show = repoData.is_show
    repoTab.created_at = repoData.created_at
  }
  const { isAuthenticated, user } = await checkAuth(event)
  if (isAuthenticated) {
    // console.log("repo_tab: ", repoTab)
    // 更新或插入数据库
    const { data, error } = await client
      .from('repo_info_tab')
      .upsert(repoTab, { onConflict: 'repo_id' })
      .select()
      .single()

    if (error) throw createError({ statusCode: 400, statusMessage: error.message })

  }
  const formattedData: RepoData = {
    name: repoTab.repo_name || '',
    description: repoTab.repo_detail.description || '',
    stars: repoTab.repo_detail.stars || 0,
    forks: repoTab.repo_detail.forks || 0,
    issues: repoTab.repo_detail.issues || 0,
    owner_name: repoTab.repo_owner || '',
    labels: githubRepoLabels,
    created_at: repoTab.created_at,
    updated_at: repoTab.updated_at
  }
  // console.log("formattedData: ", formattedData)
  return formattedData

}

// 主处理函数
export default defineEventHandler(async (event: H3Event) => {
  const method = event.node.req.method
  const url = new URL(event.node.req.url, `http://${event.node.req.headers.host}`)
  const path = url.pathname.split('/').pop()

  // 列表查询接口
  if (method === 'GET' && path === 'list') {
    return await getReposList(event)
  }

  // 按 repo id 查询接口
  if (method === 'GET' && path === 'get') {
    const { id } = getQuery(event)
    return await getRepoById(event, id as string)
  }

  // repo 更新接口
  if (method === 'PUT' && path === 'update') {
    const body = await readBody(event)
    const { id, ...updateData } = body
    return await updateRepo(event, id, updateData)
  }

  // repo 创建接口
  if (method === 'POST' && path === 'create') {
    const body = await readBody(event)
    return await createRepo(event, body)
  }

  throw createError({ statusCode: 404, statusMessage: 'Not Found' })
})