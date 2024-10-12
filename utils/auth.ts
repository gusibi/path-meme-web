import { H3Event } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export async function checkAuth(event: H3Event) {

  try {
    const user = await serverSupabaseUser(event)
    if (user) {
      return { isAuthenticated: true, user }
    }
  } catch (error) {
    console.error('Error checking authentication:', error)
  }

  // 如果 serverSupabaseUser 失败，尝试使用 cookie
  const supabase = await serverSupabaseClient(event)
  const { data: { session } } = await supabase.auth.getSession()

  const checkLoginStatus = () => {
    const githubToken = useCookie('github_token').value
    const githubUser = useCookie('github_username').value
    return !!githubToken && !!githubUser
  }
  if (session && checkLoginStatus()) {
    return { isAuthenticated: true, user: session.user }
  }

  return { isAuthenticated: false, user: null }
}

// 可选：创建一个中间件来强制要求身份验证
export function requireAuth(handler: (event: H3Event) => Promise<any>) {
  return async (event: H3Event) => {
    const { isAuthenticated } = await checkAuth(event)
    if (!isAuthenticated) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }
    return handler(event)
  }
}