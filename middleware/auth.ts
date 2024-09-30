export default defineNuxtRouteMiddleware((to) => {
    const user = useSupabaseUser()

    console.log('Auth middleware, path:', to.path, 'user:', user.value)
    // 只有访问 /profile 页面时才需要登录
    if (!user.value && to.path === '/profile') {
        return navigateTo('/login')
    }
})