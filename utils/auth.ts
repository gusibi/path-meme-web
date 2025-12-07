import { H3Event } from 'h3'
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export async function checkAuth(event: H3Event) {
  // 先尝试使用 supabase client 获取 session，避免 serverSupabaseUser 抛出错误
  const supabase = await serverSupabaseClient(event)
  const { data: { session } } = await supabase.auth.getSession()

  if (session?.user) {
    return { isAuthenticated: true, user: session.user }
  }

  // 如果没有 session，静默返回未认证状态
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