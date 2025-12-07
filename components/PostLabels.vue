<template>
  <div class="flex flex-wrap items-center gap-2">
    <NuxtLink 
      v-for="label in labels" 
      :key="label.name" 
      :to="getLabelUrl(label.name)" 
      class="text-[10px] uppercase tracking-wider font-medium hover:underline transition-colors"
      :style="{ color: `#${label.color}` }"
    >
      #{{ label.name }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

interface Label {
  name: string
  color: string
}

const props = defineProps({
  labels: {
    type: Array as PropType<Label[]>,
    required: true
  },
  repoUrl: {
    type: String,
    default: ''
  }
})

const getLabelUrl = (labelName: string) => {
  if (props.repoUrl) {
    return `${props.repoUrl}/tag/${encodeURIComponent(labelName)}`
  }
  return `/tag/${encodeURIComponent(labelName)}`
}
</script>
