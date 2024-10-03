import { defineEventHandler, getQuery } from 'h3'

const repos = [
    {
        name: "path-meme-db",
        description: "A Nuxt.js project with cool features",
        stars: 120,
        forks: 35,
        owner_name: "gusibi",
        updated_at: "2023-05-15T10:30:00Z"
    },
    {
        name: "weekly",
        description: "An awesome Vue.js library for developers",
        stars: 250,
        forks: 60,
        owner_name: "ruanyf",
        updated_at: "2023-05-10T14:45:00Z"
    },
    // ... 添加更多仓库数据
]

export default defineEventHandler((event) => {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const paginatedRepos = repos.slice(startIndex, endIndex)

    return {
        repos: paginatedRepos,
        totalItems: repos.length,
        currentPage: page,
        itemsPerPage: limit,
        totalPages: Math.ceil(repos.length / limit)
    }
})