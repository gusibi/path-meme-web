document.addEventListener('DOMContentLoaded', async () => {
    console.log('Script started');
    const timeline = document.querySelector('.timeline');
    timeline.innerHTML = '<p>Loading...</p>';

    try {
        const response = await fetch('https://path-momo-api.gusibi.workers.dev/api/blog-posts');
        console.log('API response:', response);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blogPosts = await response.json();
        console.log('Blog posts:', blogPosts);

        timeline.innerHTML = '';

        if (blogPosts.length === 0) {
            timeline.innerHTML = '<p>No blog posts found.</p>';
            return;
        }

        blogPosts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="header">
                    <img src="avatar.png" alt="User Avatar">
                    <span>Morning</span>
                </div>
                <div class="content">
                    <h2>${post.title}</h2>
                    <p>${post.body}</p>
                </div>
                <div class="time">${new Date(post.created_at).toLocaleTimeString()}</div>
            `;
            timeline.appendChild(card);
        });
    } catch (error) {
        console.error('Error:', error);
        timeline.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});