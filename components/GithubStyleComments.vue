<template>
  <div class="mt-10 border-t border-gray-200 dark:border-gray-700 pt-5">
    <h2 class="text-2xl font-bold mb-4">Comments</h2>
    <div v-for="comment in comments" :key="comment.id" class="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div class="bg-gray-100 dark:bg-gray-900 px-4 py-2 flex items-center text-sm">
        <span class="font-semibold text-gray-900 dark:text-white mr-2">{{ comment.user.login }}</span>
        <span class="text-gray-600 dark:text-gray-400">commented on {{ formatDate(comment.created_at) }}</span>
      </div>
      <div class="px-4 py-3 prose dark:prose-invert max-w-none" v-html="$md(comment.body)"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    comments: {
      type: Array,
      required: true
    }
  },
  methods: {
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
}
</script>