import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
    return [
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
    ]
})