document.addEventListener('DOMContentLoaded', async () => {
    const timeline = document.querySelector('.timeline');
    const nightModeBtn = document.querySelector('.night-mode-btn');

    // Night mode toggle
    nightModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        nightModeBtn.textContent = document.body.classList.contains('night-mode') ? '☀️' : '🌙';
    });

    try {
        const response = await fetch('https://path-momo-api.gusibi.workers.dev/api/blog-posts');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blogPosts = await response.json();

        if (blogPosts.length === 0) {
            timeline.innerHTML = '<p>No blog posts found.</p>';
            return;
        }

        blogPosts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'card';

            // 检查是否包含 meme 标签
            const isMeme = post.labels && post.labels.some(label => label.name.toLowerCase() === 'meme');

            let contentHtml = '';
            if (!isMeme) {
                contentHtml += `<h2>${post.title}</h2>`;
            }
            contentHtml += `<p>${post.body}</p>`;

            // 创建标签 HTML
            const labelsHtml = post.labels.map(label =>
                `<span class="label" style="background-color: #${label.color}">${label.name}</span>`
            ).join('');

            card.innerHTML = `
                <div class="header">
                    <img src="avatar.png" alt="User Avatar">
                    <span>Morning</span>
                </div>
                <div class="content">
                    ${contentHtml}
                </div>
                <div class="footer">
                    <span class="time">${new Date(post.created_at).toLocaleTimeString()}</span>
                    <div class="labels">${labelsHtml}</div>
                </div>
            `;
            timeline.appendChild(card);
        });
    } catch (error) {
        console.error('Error:', error);
        timeline.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});