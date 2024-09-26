import { defineStore } from 'pinia'

export const useBlogStore = defineStore('blog', {
    state: () => ({
        blogPosts: []
    }),
    actions: {
        async loadBlogPosts() {
            const config = useRuntimeConfig()
            const { data: posts, error } = await useFetch(`${config.public.apiBaseUrl}/api/blog-posts`)
            console.log(posts)

            if (error.value) {
                console.error('Error loading blog posts:', error.value)
                return
            }

            this.blogPosts = posts.value || []
        }
    }
})