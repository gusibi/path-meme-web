<template>
  <div class="container mx-auto px-4">
    <Timeline :blogPosts="blogPosts" />
  </div>
</template>

<script>
import Timeline from '~/components/Timeline.vue';

export default {
  components: {
    Timeline
  },
  async asyncData({ params, $axios }) {
    try {
      const response = await $axios.$get(`${process.env.API_BASE_URL}/api/blog-posts?tag=${encodeURIComponent(params.name)}`);
      return { blogPosts: response, tagName: params.name };
    } catch (error) {
      console.error('Error:', error);
      return { blogPosts: [], tagName: params.name };
    }
  },
  created() {
    this.$setBannerContent(`<h1 class="text-4xl font-extrabold text-center text-white mb-6">Posts tagged with "${this.tagName}"</h1>`);
  }
}
</script>