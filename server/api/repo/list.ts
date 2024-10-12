import { defineEventHandler, getQuery } from 'h3'
import { getReposList } from '../repos'

const defaultRepos = [
    {
        name: "path-meme-db",
        description: "一些胡言乱语",
        stars: 1,
        forks: 35,
        owner_name: "gusibi",
        updated_at: "2024-10-05T10:30:00Z"
    },
    {
        name: "weekly",
        description: "科技爱好者周刊，每周五发布",
        stars: 46801,
        forks: 60,
        owner_name: "ruanyf",
        updated_at: "2024-10-05T14:45:00Z"
    },
    {
        name: "Python",
        description: "All Algorithms implemented in Python",
        stars: 187181,
        forks: 60,
        owner_name: "TheAlgorithms",
        updated_at: "2024-10-05T14:45:00Z"
    },
    // ... 添加更多仓库数据
]

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10

    let repos
    try {
        // 尝试从 /api/repos/list 获取数据
        repos = await getReposList(event)
        if (repos.length == 0) {
            repos = defaultRepos
        }
    } catch (error) {
        console.error('Failed to fetch repos from API, using default data', error)
        repos = defaultRepos
    }

    // console.log("repos: ", repos)
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