import { Feed } from 'feed'
import { defineEventHandler, useRuntimeConfig, setHeader } from '#imports'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const feed = new Feed({
        title: "古思乱讲",
        description: "Your blog description",
        id: config.public.siteUrl,
        link: config.public.siteUrl,
        language: "zh-CN", // 根据您的博客语言进行调整
        image: `${config.public.siteUrl}/favicon.ico`,
        favicon: `${config.public.siteUrl}/favicon.ico`,
        copyright: `All rights reserved ${new Date().getFullYear()}, 古思乱讲`,
        feedLinks: {
            rss2: `${config.public.siteUrl}/api/rss.xml`,
        },
        author: {
            name: "Your Name",
            email: "your-email@example.com",
            link: config.public.siteUrl
        }
    })

    // 从你的 API 获取博客文章
    const response = await fetch(`${config.public.apiBaseUrl}/api/blog-posts`)
    if (!response.ok) {
        throw createError({
            statusCode: response.status,
            statusMessage: response.statusText,
            message: `Failed to fetch blog posts`
        })
    }

    const posts = await response.json()

    posts.forEach((post) => {
        feed.addItem({
            title: post.title,
            id: `${config.public.siteUrl}/blog/${post.number}`,
            link: `${config.public.siteUrl}/blog/${post.number}`,
            description: post.description,
            content: post.content,
            author: [
                {
                    name: post.author,
                    email: "author@example.com",
                    link: config.public.siteUrl
                }
            ],
            date: new Date(post.created_at),
            image: post.cover_image
        })
    })

    setHeader(event, 'Content-Type', 'application/xml')
    return feed.rss2()
})