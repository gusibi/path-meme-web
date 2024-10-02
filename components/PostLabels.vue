<template>
    <div>
        <NuxtLink v-for="label in labels" :key="label.name" :to="getLabelUrl(label.name)" class="card-label inline-block mx-1 dark:text-slate-800 transition-all duration-300 hover:scale-110" :style="{ color: `#${label.color}` }"> #{{ label.name }} </NuxtLink>
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