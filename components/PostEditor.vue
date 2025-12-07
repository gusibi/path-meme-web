<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 bg-white dark:bg-path-cardDark sm:bg-path-bg sm:dark:bg-path-dark flex flex-col animate-bounce-soft pt-14 sm:pt-16">
    <!-- Header -->
    <div class="bg-white dark:bg-path-cardDark border-b border-gray-100 dark:border-gray-800 px-4 h-16 flex items-center justify-between sticky top-0 shadow-sm z-10">
      <button @click="handleClose" class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <span class="font-serif font-bold capitalize" :class="titleColorClass">
        New {{ postType }}
      </span>
      <button 
        @click="handleSubmit" 
        :disabled="isSaving || !body.trim()"
        class="px-4 py-2 rounded-full text-white text-sm font-bold flex items-center gap-2 shadow-md hover:brightness-110 disabled:opacity-50 transition-all"
        :class="btnColorClass"
      >
        <template v-if="isSaving">Saving...</template>
        <template v-else>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
          </svg>
          Post
        </template>
      </button>
    </div>

    <!-- Main Container -->
    <div class="flex-1 overflow-hidden flex flex-col max-w-3xl mx-auto w-full p-0 sm:p-6">
      <!-- Input Area Wrapper -->
      <div class="flex-1 flex flex-col bg-transparent sm:bg-white sm:dark:bg-path-cardDark sm:rounded-xl sm:shadow-sm sm:border sm:border-gray-100 sm:dark:border-gray-800 overflow-hidden">
        
        <!-- Top Meta Area -->
        <div class="p-4 sm:px-6 sm:pt-6 pb-2">
          <!-- Diary Date -->
          <div v-if="isDiary" class="mb-4 text-xl font-serif font-bold text-purple-400 opacity-60 select-none">
            {{ formattedDate }}
          </div>
          
          <!-- Title Input -->
          <input
            v-if="showTitle"
            type="text"
            placeholder="Title"
            v-model="title"
            class="w-full text-2xl font-serif font-bold text-gray-800 dark:text-gray-100 placeholder-gray-300 border-none focus:ring-0 bg-transparent mb-2 p-0"
            autofocus
          />
        </div>

        <!-- Toolbar & Tabs -->
        <div class="flex flex-col border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-black/20">
          <!-- Tabs -->
          <div class="flex px-4 pt-2 gap-4 text-sm">
            <button 
              @click="activeTab = 'write'"
              class="pb-2 px-1 transition-colors flex items-center gap-2"
              :class="activeTab === 'write' ? activeTabClass : inactiveTabClass"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Write
            </button>
            <button 
              @click="activeTab = 'preview'"
              class="pb-2 px-1 transition-colors flex items-center gap-2"
              :class="activeTab === 'preview' ? activeTabClass : inactiveTabClass"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              Preview
            </button>
          </div>

          <!-- Formatting Tools -->
          <div v-if="activeTab === 'write'" class="px-4 py-2 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar border-t border-gray-100 dark:border-gray-800">
            <ToolButton tooltip="Bold" @click="insertText('**', '**')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"></path>
              </svg>
            </ToolButton>
            <ToolButton tooltip="Italic" @click="insertText('*', '*')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 4h4m-2 0v16m-4 0h8"></path>
              </svg>
            </ToolButton>
            <div class="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
            <ToolButton tooltip="Quote" @click="insertText('> ')">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
            </ToolButton>
            <ToolButton tooltip="Code" @click="insertText('`', '`')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
            </ToolButton>
            <ToolButton tooltip="List" @click="insertText('- ')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
            </ToolButton>
            <div class="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
            <ToolButton tooltip="Link" @click="insertText('[', '](url)')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
            </ToolButton>
            <ToolButton tooltip="Image" @click="triggerImageUpload">
              <svg v-if="!isUploading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </ToolButton>
            <input 
              type="file" 
              ref="fileInputRef" 
              class="hidden" 
              accept="image/*" 
              @change="handleImageUpload" 
            />
          </div>
        </div>

        <!-- Editor / Preview Content -->
        <div class="flex-1 relative overflow-y-auto">
          <textarea
            v-if="activeTab === 'write'"
            ref="textareaRef"
            placeholder="What's happening? (Markdown is supported)"
            v-model="body"
            class="w-full h-full p-4 sm:p-6 text-base leading-relaxed text-gray-700 dark:text-gray-300 placeholder-gray-300 border-none focus:ring-0 bg-transparent resize-none font-sans"
          ></textarea>
          <div v-else class="w-full h-full p-4 sm:p-6 prose prose-lg dark:prose-invert max-w-none">
            <div v-if="body" v-html="renderedMarkdown"></div>
            <span v-else class="text-gray-400 italic">Nothing to preview</span>
          </div>
        </div>

        <!-- Footer: Tags -->
        <div class="p-3 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-gray-800">
          <!-- Selected Tags -->
          <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2 mb-2">
            <span 
              v-for="tag in selectedTags" 
              :key="tag"
              class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-path-red/10 text-path-red"
            >
              {{ tag }}
              <button @click="removeTag(tag)" class="hover:text-red-700 transition-colors">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </span>
          </div>
          <!-- Tag Input -->
          <div class="relative flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            <input
              type="text"
              placeholder="Search tags..."
              v-model="tagInput"
              @focus="handleTagInputFocus"
              @blur="handleTagInputBlur"
              class="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-600 dark:text-gray-400 placeholder-gray-400"
            />
            <!-- Dropdown -->
            <div 
              v-if="showTagDropdown && (filteredLabels.length > 0 || isLoadingLabels)"
              class="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-path-cardDark border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto z-20"
            >
              <div v-if="isLoadingLabels" class="p-3 text-center text-sm text-gray-400">
                Loading...
              </div>
              <template v-else>
                <button
                  v-for="label in filteredLabels"
                  :key="label.id"
                  @mousedown.prevent="selectTag(label.name)"
                  class="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors"
                  :class="{ 'opacity-50': selectedTags.includes(label.name) }"
                >
                  <span 
                    class="w-3 h-3 rounded-full" 
                    :style="{ backgroundColor: '#' + label.color }"
                  ></span>
                  <span class="text-gray-700 dark:text-gray-300">{{ label.name }}</span>
                  <span v-if="label.description" class="text-xs text-gray-400 truncate ml-auto">{{ label.description }}</span>
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRuntimeConfig } from '#imports'

// PostType enum
enum PostType {
  ARTICLE = 'article',
  TEXT = 'text',
  DIARY = 'diary',
}

const props = defineProps<{
  isVisible: boolean
  type: 'article' | 'text' | 'diary'
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', data: { title: string | null; body: string; tags: string[] }): void
  (e: 'posted', issue: { number: number; title: string; html_url: string }): void
  (e: 'error', message: string): void
}>()

const config = useRuntimeConfig()
const title = ref('')
const body = ref('')
const tagInput = ref('')
const selectedTags = ref<string[]>([])
const isSaving = ref(false)
const activeTab = ref<'write' | 'preview'>('write')
const isUploading = ref(false)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

// Tag search
const allLabels = ref<{ id: number; name: string; color: string; description: string }[]>([])
const isLoadingLabels = ref(false)
const showTagDropdown = ref(false)

const postType = computed(() => props.type)
const isDiary = computed(() => props.type === PostType.DIARY)
const showTitle = computed(() => props.type !== PostType.TEXT && !isDiary.value)

// Filter labels based on input
const filteredLabels = computed(() => {
  const query = tagInput.value.toLowerCase().trim()
  if (!query) return []
  return allLabels.value
    .filter(l => l.name.toLowerCase().includes(query) && !selectedTags.value.includes(l.name))
    .slice(0, 10)
})

// Fetch labels on mount
const fetchLabels = async () => {
  if (allLabels.value.length > 0) return
  isLoadingLabels.value = true
  try {
    const labels = await $fetch('/api/tags')
    allLabels.value = labels as any[]
  } catch (e) {
    console.error('Failed to fetch labels:', e)
  } finally {
    isLoadingLabels.value = false
  }
}

const selectTag = (tagName: string) => {
  if (!selectedTags.value.includes(tagName)) {
    selectedTags.value.push(tagName)
  }
  tagInput.value = ''
  // Keep dropdown open for adding more tags
}

const removeTag = (tagName: string) => {
  selectedTags.value = selectedTags.value.filter(t => t !== tagName)
}

const handleTagInputFocus = () => {
  fetchLabels()
}

const handleTagInputBlur = () => {
  // Delay to allow click on dropdown item
  setTimeout(() => {
    showTagDropdown.value = false
  }, 200)
}

// Watch tagInput to show/hide dropdown
watch(tagInput, (newVal) => {
  if (newVal.trim()) {
    showTagDropdown.value = true
  } else {
    showTagDropdown.value = false
  }
})

const formattedDate = computed(() => {
  return new Date().toLocaleDateString(undefined, { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  })
})

const titleColorClass = computed(() => {
  if (isDiary.value) return 'text-purple-600 dark:text-purple-400'
  if (props.type === PostType.ARTICLE) return 'text-green-600 dark:text-green-400'
  return 'text-blue-600 dark:text-blue-400'
})

const btnColorClass = computed(() => {
  if (isDiary.value) return 'bg-purple-500'
  if (props.type === PostType.ARTICLE) return 'bg-green-500'
  return 'bg-blue-500'
})

const activeTabClass = 'border-b-2 border-path-red text-gray-900 dark:text-white font-bold'
const inactiveTabClass = 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'

// Simple markdown to HTML (basic implementation)
const renderedMarkdown = computed(() => {
  let html = body.value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.*)$/gm, '<li>$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full" />')
    .replace(/\n/g, '<br>')
  return html
})

const handleClose = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  title.value = ''
  body.value = ''
  tagInput.value = ''
  selectedTags.value = []
  activeTab.value = 'write'
}

const generateTitle = () => {
  if (props.type === PostType.TEXT) {
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 19).replace('T', '-').replace(/:/g, '-')
    return `meme-${dateStr}`
  }
  if (isDiary.value) {
    const now = new Date()
    return `diary-${now.toISOString().slice(0, 10)}`
  }
  return title.value || 'Untitled'
}

const getHost = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return config.public.siteUrl || 'https://momo.gusibi.site'
}

const handleSubmit = async () => {
  if (!body.value.trim()) return
  isSaving.value = true
  
  try {
    const host = getHost()
    const finalTitle = generateTitle()
    const signature = `\n\n---\n来自 [path-meme](${host})`
    const finalBody = body.value.trim() + signature

    const response = await $fetch('/api/github/create-issue', {
      method: 'POST',
      body: {
        title: finalTitle,
        content: finalBody,
        labels: selectedTags.value
      }
    })

    if (response.success) {
      emit('posted', response.issue)
      emit('save', {
        title: showTitle.value ? title.value : null,
        body: body.value,
        tags: selectedTags.value
      })
      handleClose()
    }
  } catch (error: any) {
    console.error('Failed to create post:', error)
    emit('error', error.data?.statusMessage || error.message || 'Failed to create post')
  } finally {
    isSaving.value = false
  }
}

const insertText = (prefix: string, suffix: string = '') => {
  const textarea = textareaRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = textarea.value
  const before = text.substring(0, start)
  const selection = text.substring(start, end)
  const after = text.substring(end)

  body.value = `${before}${prefix}${selection}${suffix}${after}`
  
  nextTick(() => {
    textarea.focus()
    textarea.setSelectionRange(start + prefix.length, end + prefix.length)
  })
}

const triggerImageUpload = () => {
  fileInputRef.value?.click()
}

const handleImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  isUploading.value = true
  const reader = new FileReader()
  reader.onloadend = () => {
    const base64 = reader.result as string
    const imgMarkdown = `\n![${file.name}](${base64})\n`
    const textarea = textareaRef.value
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = textarea.value
      body.value = text.substring(0, start) + imgMarkdown + text.substring(end)
    } else {
      body.value += imgMarkdown
    }
    isUploading.value = false
  }
  reader.readAsDataURL(file)
}

// Reset form when visibility changes (keep only one watch for isVisible)
watch(() => props.isVisible, (newVal) => {
  if (!newVal) {
    resetForm()
  } else if (props.type === PostType.TEXT && !selectedTags.value.includes('meme')) {
    selectedTags.value = ['meme']
  }
})
</script>

<script lang="ts">
// ToolButton component
import { defineComponent, h } from 'vue'

const ToolButton = defineComponent({
  props: {
    tooltip: String
  },
  emits: ['click'],
  setup(props, { slots, emit }) {
    return () => h('button', {
      onClick: () => emit('click'),
      title: props.tooltip,
      class: 'p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-path-red transition-colors'
    }, slots.default?.())
  }
})

export { ToolButton }
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
