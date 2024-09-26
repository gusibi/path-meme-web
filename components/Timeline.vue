<template>
  <div class="container max-w-content mx-auto px-4">
    <div class="space-y-8">
      <div v-for="post in blogPosts" :key="post.id" class="flex items-start">
        <div class="flex-shrink-0 mr-4">
          <span class="inline-flex items-center justify-center w-8 h-8 rounded-full text-white" :style="{ backgroundColor: getLabelColor(post.labels) }">
            {{ getFirstLabelChar(post.labels) }}
          </span>
        </div>
        <div class="flex-grow bg-card-light dark:bg-card-dark rounded-lg px-6 py-8 shadow-xl">
          <h3 class="text-xl font-medium">
            <NuxtLink :to="`/blog/${post.number}`" class="hover:underline">{{ post.title }}</NuxtLink>
          </h3>
          <div class="mt-2 text-sm prose dark:prose-invert" v-html="$md(post.body)"></div>
          <div class="mt-4 flex justify-between items-center text-sm">
            <div class="flex items-center space-x-4">
              <span class="text-gray-500 dark:text-gray-400">{{ formatDate(post.created_at, false) }}</span>
              <div v-html="renderReactions(post.reactions)"></div>
            </div>
            <div class="flex items-center space-x-4">
              <NuxtLink class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" :to="`/blog/${post.number}`">💬 {{ post.comments || 0 }}</NuxtLink>
              <span v-for="label in renderLabels(post.labels)" :key="label.name" class="card-label inline-block text-white dark:text-slate-800 rounded-full px-2 py-1 text-xs font-semibold mr-2" :style="{ backgroundColor: label.color }">
                <NuxtLink :to="`/tag/${encodeURIComponent(label.name)}`" class="hover:underline">
                  {{ label.displayName }}
                </NuxtLink>
              </span>
              <a class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" :href="post.html_url" target="_blank">🔗</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType } from 'vue'

interface BlogPost {
  id: number
  number: number
  title: string
  body: string
  created_at: string
  reactions: Record<string, number>
  comments: number
  html_url: string
  labels: Array<{ color: string; name: string }>
}

const props = defineProps({
  blogPosts: {
    type: Array as PropType<BlogPost[]>,
    required: true
  }
})

const formatDate = (dateString: string, showYear = false) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  if (showYear) {
    return `${year}-${month}-${day} ${hours}:${minutes}`
  } else {
    return `${month}-${day} ${hours}:${minutes}`
  }
}

const renderReactions = (reactions: Record<string, number>) => {
  const reactionTypes = ['+1', '-1', 'laugh', 'hooray', 'confused', 'heart', 'rocket', 'eyes']
  const reactionEmojis: Record<string, string> = { '👍': '+1', '👎': '-1', '😄': 'laugh', '🎉': 'hooray', '😕': 'confused', '❤️': 'heart', '🚀': 'rocket', '👀': 'eyes' }

  const reactionHtml = reactionTypes
    .filter(type => reactions[type] > 0)
    .map(type => `
      <button class="reaction inline-flex items-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-2 py-1 text-xs font-semibold mr-2" data-reaction="${type}">
        <span class="reaction-emoji mr-1">${Object.keys(reactionEmojis).find(key => reactionEmojis[key] === type)}</span>
        <span class="reaction-count">${reactions[type]}</span>
      </button>
    `)
    .join('')

  return `<div class="card-reactions flex space-x-2">${reactionHtml}</div>`
}

const renderLabels = (labels: Array<{ color: string; name: string }>) => {
  return labels.map(label => ({
    color: `#${label.color}`,
    name: label.name,
    displayName: label.name.length > 10 ? label.name.substring(0, 10) + '...' : label.name
  }))
}

const getLabelColor = (labels: Array<{ color: string }>) => {
  return labels.length > 0 ? `#${labels[0].color}` : '#ccc'
}

const getFirstLabelChar = (labels: Array<{ name: string }>) => {
  return labels.length > 0 ? labels[0].name.charAt(0) : '•'
}
</script>