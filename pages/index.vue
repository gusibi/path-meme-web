<template>
  <div>
    <Timeline :blogPosts="blogPosts" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Timeline from '~/components/Timeline.vue';

export default {
  components: {
    Timeline
  },
  computed: {
    ...mapState(['blogPosts']),
  },
  mounted() {
    this.loadBlogPosts();
  },
  methods: {
    ...mapActions(['loadBlogPosts'])
  },
  created() {
    this.$setBannerContent(''); // 或者设置为默认的 banner 内容
  }
}
</script>