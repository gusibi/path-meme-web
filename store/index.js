export const state = () => ({
    blogPosts: []
});

export const mutations = {
    setBlogPosts(state, blogPosts) {
        state.blogPosts = blogPosts;
    }
};

export const actions = {
    async loadBlogPosts({ commit }) {
        try {
            const response = await fetch(`${process.env.API_BASE_URL}/api/blog-posts`);
            const blogPosts = await response.json();
            commit('setBlogPosts', blogPosts);
        } catch (error) {
            console.error('Error:', error);
        }
    }
};