document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('https://path-momo-api.gusibi.workers.dev/momos');
    const blogPosts = await response.json();
    const timeline = document.querySelector('.timeline');

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
});