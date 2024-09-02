addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    const response = await fetch('https://api.github.com/repos/{owner}/{repo}/issues')
    const issues = await response.json()
    const blogPosts = issues.map(issue => ({
        title: issue.title,
        body: issue.body,
        created_at: issue.created_at
    }))
    return new Response(JSON.stringify(blogPosts), {
        headers: { 'content-type': 'application/json' }
    })
}