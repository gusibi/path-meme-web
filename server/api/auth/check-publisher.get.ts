import { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig()
  
  // 从私有环境变量获取允许发布的用户 ID
  const allowedPublisherId = config.allowedPublisherId
  
  if (!allowedPublisherId) {
    return {
      canPublish: false,
      reason: 'Publisher ID not configured'
    }
  }

  try {
    // 使用 serverSupabaseClient 获取 session，未登录时不会抛错
    const client = await serverSupabaseClient(event)
    const { data: { user } } = await client.auth.getUser()
    
    if (!user) {
      return {
        canPublish: false,
        reason: 'Not logged in'
      }
    }

    // 检查用户 ID 是否匹配
    const canPublish = user.id === allowedPublisherId
    
    return {
      canPublish,
      reason: canPublish ? 'Authorized' : 'Not authorized to publish'
    }
  } catch (error: any) {
    // 未登录或其他错误，静默返回 false
    return {
      canPublish: false,
      reason: 'Not logged in'
    }
  }
})
