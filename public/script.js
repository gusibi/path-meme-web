document.addEventListener('DOMContentLoaded', async () => {
    const timeline = document.querySelector('.timeline');
    const nightModeBtn = document.querySelector('.night-mode-btn');

    // Night mode toggle
    nightModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        nightModeBtn.textContent = document.body.classList.contains('night-mode') ? '☀️' : '🌙';
        localStorage.setItem('nightMode', document.body.classList.contains('night-mode'));
    });

    // Apply saved night mode state
    const savedNightMode = localStorage.getItem('nightMode');
    if (savedNightMode === 'true') {
        document.body.classList.add('night-mode');
        nightModeBtn.textContent = '☀️';
    }

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

            const date = new Date(post.created_at);
            const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
            const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

            let titleHtml = '';
            if (post.title && !post.labels.some(label => label.name.toLowerCase() === 'meme')) {
                titleHtml = `<h2 class="card-title" onclick="window.open('/blog/${post.number}', '_blank')">${post.title}</h2>`;
            }

            const labelsHtml = post.labels.map(label =>
                `<span class="card-label" style="background-color: #${label.color}" onclick="window.open('/tag/${label.name}', '_blank')">${label.name}</span>`
            ).join('');

            const reactionsHtml = Object.entries(post.reactions).map(([reaction, count]) =>
                count > 0 ? `<span class="reaction">${getReactionEmoji(reaction)} ${count}</span>` : ''
            ).join('');

            card.innerHTML = `
                <div class="card-date">
                    <span class="card-date-icon">🕒</span>
                    <span class="card-date-text">${formattedDate}</span>
                </div>
                ${titleHtml}
                <div class="card-content">${marked(post.body)}</div>
                <div class="card-footer">
                    <div class="card-footer-left">
                        <span class="card-time">${formattedTime}</span>
                        <div class="card-reactions">${reactionsHtml}</div>
                    </div>
                    <div class="card-footer-right">
                        <div class="card-labels">${labelsHtml}</div>
                        <a href="${post.html_url}" class="github-link" target="_blank">🔗</a>
                    </div>
                </div>
            `;

            timeline.appendChild(card);
        });
    } catch (error) {
        console.error('Error:', error);
        timeline.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});

function getReactionEmoji(reaction) {
    const reactionMap = {
        '+1': '👍',
        '-1': '👎',
        'laugh': '😄',
        'hooray': '🎉',
        'confused': '😕',
        'heart': '❤️',
        'rocket': '🚀',
        'eyes': '👀'
    };
    return reactionMap[reaction] || '';
}