<template>
  <main class="container max-w-content mx-auto px-4 py-8">
    <article class="bg-card-light dark:bg-card-dark rounded-lg shadow-xl overflow-hidden">
      <div class="px-6 py-8">
        <h1 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{{ post.title }}</h1>
        <div class="mb-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
          <span class="mr-4">{{ formatDate(post.created_at, true) }}</span>
          <span v-html="renderLabels(post.labels)"></span>
        </div>
        <div class="prose dark:prose-invert max-w-none" v-html="$md(post.body)"></div>
        <div class="mt-6" v-html="renderReactions(post.reactions)"></div>
      </div>
    </article>

    <div class="mt-8">
      <h3 class="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Comments</h3>
      <div v-if="post.comments && post.comments.length > 0">
        <div v-for="comment in post.comments" :key="comment.id" class="mb-6 bg-card-light dark:bg-card-dark rounded-lg shadow-md overflow-hidden">
          <div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 flex justify-between items-center">
            <span class="font-semibold text-gray-900 dark:text-white">{{ comment.user.login }}</span>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ formatDate(comment.created_at, true) }}</span>
          </div>
          <div class="px-4 py-3 prose dark:prose-invert max-w-none" v-html="$md(comment.body)"></div>
        </div>
      </div>
      <p v-else class="text-gray-600 dark:text-gray-400">No comments yet.</p>
    </div>

    <a :href="post.html_url" target="_blank" class="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
      Comment on GitHub
    </a>
  </main>
</template>

<script>
export default {
  async asyncData({ params, $axios }) {
    try {
      const response = await $axios.$get(`${process.env.API_BASE_URL}/api/blog-posts/${params.id}`);
      return { post: response };
    } catch (error) {
      console.error('Error:', error);
      return { post: null };
    }
  },
  methods: {
    formatDate(dateString, showYear = false) {
      const date = new Date(dateString);
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    },
    renderLabels(labels) {
      return labels.map(label =>
        `<span class="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2 mb-2" style="background-color: #${label.color}">
          <a href="/tag/${encodeURIComponent(label.name)}" class="hover:underline">${label.name}</a>
        </span>`
      ).join('');
    },
    renderReactions(reactions) {
      const reactionTypes = ['+1', '-1', 'laugh', 'hooray', 'confused', 'heart', 'rocket', 'eyes'];
      const reactionEmojis = { '👍': '+1', '👎': '-1', '😄': 'laugh', '🎉': 'hooray', '😕': 'confused', '❤️': 'heart', '🚀': 'rocket', '👀': 'eyes' };

      const reactionHtml = reactionTypes
        .filter(type => reactions[type] > 0)
        .map(type => `
          <button class="inline-flex items-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
            <span class="mr-1">${Object.keys(reactionEmojis).find(key => reactionEmojis[key] === type)}</span>
            <span>${reactions[type]}</span>
          </button>
        `)
        .join('');

      return `<div class="flex flex-wrap">${reactionHtml}</div>`;
    }
  }
}
</script>