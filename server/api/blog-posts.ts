// server/api/blog-posts.ts

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    try {
        const response = await $fetch(`${config.public.apiBaseUrl}/api/blog-posts`)
        return response
    } catch (error) {
        console.error('Error fetching blog posts:', error)
        return []
    }
})