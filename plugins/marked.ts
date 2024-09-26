import { defineNuxtPlugin } from '#app'
import { marked } from 'marked'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('md', (content: string) => marked.parse(content))
})