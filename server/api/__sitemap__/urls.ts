import { defineSitemapEventHandler, asSitemapUrl, useRuntimeConfig } from '#imports'

export default defineSitemapEventHandler(async () => {
  const config = useRuntimeConfig()
  let repoList = ["gusibi/path-meme-db", 'ruanyf/weekly']

  const fetchBlogPosts = async (repo: string, page = 1, perPage = 50) => {
    try {
      const response = await $fetch(`/api/repo/${repo}/blog-posts`, {
        params: { page, perPage }
      })
      // console.log("reponse: ", response)
      return response.blogPosts || []
    } catch (error) {
      console.error(`Failed to fetch blog posts for ${repo}:`, error)
      return []
    }
  }

  let allPosts = []

  for (const repo of repoList) {
    console.log("repo: ", repo)
    let page = 1
    let posts = []
    do {
      const fetchedPosts = await fetchBlogPosts(repo, page)
      // console.log("fetchedPosts", fetchedPosts)
      posts = posts.concat(fetchedPosts)
      page++
    } while (posts.length % 100 === 0 && posts.length > 0) // 假设每页100篇文章，如果不足100说明是最后一页

    allPosts = allPosts.concat(posts)
  }

  return allPosts.map(post => asSitemapUrl({
    loc: post.html_url,
    lastmod: post.updated_at,
    changefreq: 'weekly',
    priority: 0.8
  }))
})