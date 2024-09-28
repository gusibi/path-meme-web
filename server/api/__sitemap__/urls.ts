import { defineSitemapEventHandler, asSitemapUrl, useRuntimeConfig } from '#imports'

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()
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
  return posts.map(post => asSitemapUrl({
    loc: `/blog/${post.number}`,
    lastmod: post.updated_at,
    changefreq: 'weekly',
    priority: 0.8
  }))
})