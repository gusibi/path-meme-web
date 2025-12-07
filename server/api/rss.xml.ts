import { Feed } from 'feed'
import { defineEventHandler, useRuntimeConfig, setHeader } from '#imports'
import { getIssuesList } from './github/issues'

interface Post {
    number: number
    title: string
    body?: string
    description?: string
    content?: string
    author?: string
    created_at: string
    cover_image?: string
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const feed = new Feed({
        title: "古思乱讲",
        description: "Your blog description",
        id: config.public.siteUrl,
        link: config.public.siteUrl,
        language: "zh-CN",
        image: `${config.public.siteUrl}/favicon.ico`,
        favicon: `${config.public.siteUrl}/favicon.ico`,
        copyright: `All rights reserved ${new Date().getFullYear()}, 古思乱讲`,
        feedLinks: {
            rss2: `${config.public.siteUrl}/api/rss.xml`,
        },
        author: {
            name: "古思乱讲",
            email: "your-email@example.com",
            link: config.public.siteUrl
        }
    })

    // 使用内部 API 获取博客文章
    const repoOwner = config.public.repoOwner
    const repoName = config.public.repoName
    const { issues: posts } = await getIssuesList(event, repoOwner, repoName, '', 20, 1)

    posts.forEach((post: Post) => {
        feed.addItem({
            title: post.title,
            id: `${config.public.siteUrl}/blog/${post.number}`,
            link: `${config.public.siteUrl}/blog/${post.number}`,
            description: post.body?.slice(0, 200) || '',
            content: post.body || '',
            author: [
                {
                    name: post.author || '古思乱讲',
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