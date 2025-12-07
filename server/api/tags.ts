// server/api/tags.ts
import { getRepoLabels } from './github/issues'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const repoOwner = config.public.repoOwner
  const repoName = config.public.repoName

  try {
    const labels = await getRepoLabels(event, repoOwner, repoName)
    return labels
  } catch (error) {
    console.error('Error fetching tags:', error)
    throw createError({
      statusCode: 500,
      message: 'Error fetching tags'
    })
  }
})
