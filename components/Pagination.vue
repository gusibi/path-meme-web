<template>
  <div class="bg-card-light dark:bg-card-dark rounded-lg shadow-xl overflow-hidden flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 mt-6 sm:px-6">
    <div class="flex flex-1 justify-between sm:hidden">
      <a href="#" @click.prevent="onPageChange(currentPage - 1)" :class="[currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50', 'relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700']" :aria-disabled="currentPage === 1"> Previous </a>
      <a href="#" @click.prevent="onPageChange(currentPage + 1)" :class="[currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50', 'relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700']" :aria-disabled="currentPage === totalPages"> Next </a>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700"> Showing <span class="font-medium">{{ startItem }}</span> to <span class="font-medium">{{ endItem }}</span> of <span class="font-medium">{{ totalItems }}</span> results </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <a href="#" @click.prevent="onPageChange(currentPage - 1)" :class="[currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50', 'relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300']" :aria-disabled="currentPage === 1">
            <span class="sr-only">Previous</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
            </svg>
          </a>
          <template v-for="page in displayedPages" :key="page">
            <a href="#" @click.prevent="onPageChange(page)" :class="[page === currentPage ? 'z-10 bg-indigo-600 text-white' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50', 'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600']">
              {{ page }}
            </a>
          </template>
          <a href="#" @click.prevent="onPageChange(currentPage + 1)" :class="[currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50', 'relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300']" :aria-disabled="currentPage === totalPages">
            <span class="sr-only">Next</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  perPage: { type: Number, required: true },
});

const emit = defineEmits(['pageChange']);

const totalPages = computed(() => Math.ceil(props.totalItems / props.perPage));

const startItem = computed(() => ((props.currentPage - 1) * props.perPage) + 1);
const endItem = computed(() => Math.min(props.currentPage * props.perPage, props.totalItems));

const displayedPages = computed(() => {
  const range = 2;
  const pages = [];
  for (let i = Math.max(1, props.currentPage - range); i <= Math.min(totalPages.value, props.currentPage + range); i++) {
    pages.push(i);
  }
  return pages;
});

const onPageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('pageChange', page);
  }
};
</script>