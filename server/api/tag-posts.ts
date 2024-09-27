// server/api/tag-posts.ts
export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const query = getQuery(event)
    const tag = query.tag as string

    if (!tag) {
        throw createError({
            statusCode: 400,
            message: 'Tag parameter is required'
        })
    }

    try {
        const response = await $fetch(`${config.public.apiBaseUrl}/api/blog-posts`, {
            params: { tag }
        })
        return response
    } catch (error) {
        console.error('Error fetching tagged posts:', error)
        throw createError({
            statusCode: 500,
            message: 'Error fetching tagged posts'
        })
    }
})