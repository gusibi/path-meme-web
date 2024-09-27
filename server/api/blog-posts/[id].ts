// server/api/blog-posts/[id].ts

import { defineEventHandler } from 'h3'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const id = event.context.params?.id

    try {
        // 使用配置中的 API 基础 URL
        const response = await $fetch(`${config.public.apiBaseUrl}/api/blog-posts/${id}`)

        if (!response.ok) {
            throw createError({
                statusCode: response.status,
                statusMessage: response.statusText,
                message: `Failed to fetch blog post with id ${id}`
            })
        }

        const post = await response.json()
        return post
    } catch (error) {
        console.error('Error fetching blog post:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: 'An error occurred while fetching the blog post'
        })
    }
})