export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient()

    console.log('Auth middleware executing')
    console.log('Route:', to.path)
    console.log('User:', user.value)

    // 检查会话状态
    const checkSession = async () => {
        const { data, error } = await supabase.auth.getSession()
        console.log('[middleware auth] Session check:', data, error)
        return data.session
    }

    // 只有访问 /profile 页面时才需要登录
    if (to.path === '/profile') {
        return checkSession().then(session => {
            if (!session) {
                console.log('[middleware auth] No session, redirecting to login')
                return navigateTo('/login')
            }
        })
    }

    // 如果用户已登录且尝试访问登录页面，重定向到首页
    if (to.path === '/login') {
        return checkSession().then(session => {
            if (session) {
                console.log('[middleware auth] Session exists, redirecting to home')
                return navigateTo('/')
            }
        })
    }
})