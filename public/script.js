document.addEventListener('DOMContentLoaded', async () => {
    const app = document.getElementById('app');
    const nightModeBtn = document.querySelector('.night-mode-btn');
    const floatingTimeLabel = document.createElement('div');
    floatingTimeLabel.className = 'floating-time-label';
    document.body.appendChild(floatingTimeLabel);

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

    // Initialize router
    const router = new Navigo('/');

    router
        .on('/', async () => {
            app.innerHTML = '<div class="timeline"></div>';
            const timeline = document.querySelector('.timeline');
            await loadBlogPosts(timeline);
        })
        .on('/blog/:id', async ({ data }) => {
            const postId = data.id;
            await loadBlogPost(postId);
        })
        .on('/tag/:name', async ({ data }) => {
            const tagName = data.name;
            app.innerHTML = '<div class="timeline"></div>';
            const timeline = document.querySelector('.timeline');
            await loadBlogPostsByTag(tagName, timeline);
        })
        .resolve();

    // Load all blog posts
    async function loadBlogPosts(timeline) {
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

            renderBlogPosts(blogPosts, timeline);
        } catch (error) {
            console.error('Error:', error);
            timeline.innerHTML = `<p>Error: ${error.message}</p>`;
        }

        // 添加滚动事件监听器
        let isScrolling;
        window.addEventListener('scroll', () => {
            clearTimeout(isScrolling);
            floatingTimeLabel.style.opacity = '1';

            const cards = document.querySelectorAll('.card');
            let visibleCard = null;

            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    visibleCard = card;
                }
            });

            if (visibleCard) {
                const dateTime = visibleCard.querySelector('.card-datetime').textContent;
                floatingTimeLabel.textContent = dateTime;
            }

            isScrolling = setTimeout(() => {
                floatingTimeLabel.style.opacity = '0';
            }, 1500);
        });
    }

    // Load a single blog post
    async function loadBlogPost(postId) {
        try {
            const response = await fetch(`https://path-momo-api.gusibi.workers.dev/api/blog-posts/${postId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const post = await response.json();
            renderBlogPostDetail(post);
        } catch (error) {
            console.error('Error:', error);
            app.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    }

    // Load blog posts by tag
    async function loadBlogPostsByTag(tagName, timeline) {
        try {
            const response = await fetch(`https://path-momo-api.gusibi.workers.dev/api/blog-posts?tag=${encodeURIComponent(tagName)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blogPosts = await response.json();

            if (blogPosts.length === 0) {
                timeline.innerHTML = '<p>No blog posts found.</p>';
                return;
            }

            renderBlogPosts(blogPosts, timeline);
        } catch (error) {
            console.error('Error:', error);
            timeline.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    }

    function renderBlogPosts(blogPosts, timeline) {
        let currentMonth = '';
        blogPosts.forEach((post, index) => {
            const card = document.createElement('div');
            card.className = 'card';

            const date = new Date(post.created_at);
            const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const formattedTime = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (monthYear !== currentMonth) {
                if (index > 0) {
                    const monthDivider = document.createElement('div');
                    monthDivider.className = 'month-divider';
                    monthDivider.textContent = currentMonth;
                    timeline.appendChild(monthDivider);
                }
                currentMonth = monthYear;
            }

            card.innerHTML = `
                <div class="timeline-point" style="background-color: ${getLabelColor(post.labels)};">${getFirstLabelChar(post.labels)}</div>
                ${renderCardContent(post)}
            `;

            timeline.appendChild(card);
        });
    }

    function renderBlogPostDetail(post) {
        app.innerHTML = `
            <div class="post-detail">
                <h1>${post.title}</h1>
                <div class="post-meta">
                    <span>${formatDate(post.created_at, true)}</span>
                    <span>${renderLabels(post.labels)}</span>
                </div>
                <div class="post-content">${marked(post.body)}</div>
                ${renderReactions(post.reactions)}
                <div class="comment-section">
                    <h3>Comments</h3>
                    ${post.comments && post.comments.length > 0 ? renderComments(post.comments) : '<p>No comments yet.</p>'}
                </div>
                <a href="${post.html_url}" class="comment-button" target="_blank">Comment on GitHub</a>
            </div>
        `;
    }

    function renderCardContent(post) {
        const titleHtml = post.title && !post.labels.some(label => label.name.toLowerCase() === 'meme')
            ? `<h2 class="card-title"><a href="/blog/${post.number}" data-navigo>${post.title}</a></h2>`
            : '';

        const isMobile = window.innerWidth <= 768;
        const reactions = isMobile ? renderReactions({ [Object.keys(post.reactions).find(key => post.reactions[key] > 0)]: post.reactions[Object.keys(post.reactions).find(key => post.reactions[key] > 0)] }) : renderReactions(post.reactions);
        const labels = isMobile ? renderLabels(post.labels.slice(0, 1)) : renderLabels(post.labels);

        return `
            ${titleHtml}
            <div class="card-content">${marked(post.body)}</div>
            <div class="card-footer">
                <div class="card-footer-left">
                    <span class="card-datetime">${formatDate(post.created_at, !isMobile)}</span>
                    ${reactions}
                </div>
                <div class="card-footer-right">
                    <a href="/blog/${post.number}" class="card-comments" data-navigo>
                        💬 ${post.comments || 0}
                    </a>
                    ${labels}
                    <a href="${post.html_url}" class="github-link" target="_blank">🔗</a>
                </div>
            </div>
        `;
    }

    function renderReactions(reactions) {
        const reactionTypes = ['+1', '-1', 'laugh', 'hooray', 'confused', 'heart', 'rocket', 'eyes'];
        const reactionEmojis = { '👍': '+1', '👎': '-1', '😄': 'laugh', '🎉': 'hooray', '😕': 'confused', '❤️': 'heart', '🚀': 'rocket', '👀': 'eyes' };

        const reactionHtml = reactionTypes
            .filter(type => reactions[type] > 0)
            .map(type => `
                <button class="reaction" data-reaction="${type}">
                    <span class="reaction-emoji">${Object.keys(reactionEmojis).find(key => reactionEmojis[key] === type)}</span>
                    <span class="reaction-count">${reactions[type]}</span>
                </button>
            `)
            .join('');

        return `<div class="card-reactions">${reactionHtml}</div>`;
    }

    function renderLabels(labels) {
        return labels.map(label =>
            `<span class="card-label" style="background-color: #${label.color}" title="${label.name}">
                <a href="/tag/${encodeURIComponent(label.name)}" data-navigo>${label.name.length > 10 ? label.name.substring(0, 10) + '...' : label.name}</a>
            </span>`
        ).join('');
    }

    function renderComments(comments) {
        return comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-author">${comment.user.login}</span>
                    <span class="comment-date">${formatDate(comment.created_at)}</span>
                </div>
                <div class="comment-body">${marked(comment.body)}</div>
            </div>
        `).join('');
    }

    function formatDate(dateString, showYear = false) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        if (showYear) {
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        } else {
            return `${month}-${day} ${hours}:${minutes}`;
        }
    }


    function getLabelColor(labels) {
        return labels.length > 0 ? `#${labels[0].color}` : '#ccc';
    }

    function getFirstLabelChar(labels) {
        return labels.length > 0 ? labels[0].name.charAt(0) : '•';
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