<template>
  <div class="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
    <header class="bg-primary">
      <nav class="max-w-content mx-auto px-4 py-2 flex justify-between items-center">
        <div class="text-white text-xl font-bold cursor-pointer" @click="navigateToHome">古思乱讲</div>
        <button class="text-white text-2xl" @click="toggleNightMode">{{ nightModeIcon }}</button>
      </nav>
    </header>
    <div class="relative h-64 overflow-hidden">
      <img class="w-full h-full object-cover" src="/images/banners/banner2.jpeg" alt="Banner" />
      <img class="absolute bottom-4 left-4 w-16 h-16 rounded-full border-2 border-white" src="https://avatars.githubusercontent.com/u/1282277?v=4" alt="Avatar" />
      <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div v-html="$getBannerContent()"></div>
      </div>
    </div>
    <main class="flex-grow my-8">
      <nuxt />
    </main>
    <footer class="bg-card-light dark:bg-card-dark py-4">
      <div class="max-w-content mx-auto px-4 text-center">
        <div class="mb-2">
          <a href="https://momo.gusibi.mobi" class="mr-4 hover:underline">本站地址</a>
          <a href="/rss.xml" class="hover:underline">RSS</a>
        </div>
        <div class="text-sm text-gray-500">Design by gusibi@path-meme</div>
      </div>
    </footer>
    <div ref="floatingTimeLabel" class="fixed top-5 right-5 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm opacity-0 transition-opacity duration-300"></div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      nightModeIcon: '🌙',
    };
  },
  mounted() {
    this.initializeNightMode();
    this.addScrollEventListener();
  },
  methods: {
    toggleNightMode() {
      document.documentElement.classList.toggle('dark');
      this.nightModeIcon = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
      localStorage.setItem('nightMode', document.documentElement.classList.contains('dark'));
    },
    initializeNightMode() {
      const savedNightMode = localStorage.getItem('nightMode');
      if (savedNightMode === 'true') {
        document.documentElement.classList.add('dark');
        this.nightModeIcon = '☀️';
      }
    },
    navigateToHome(event) {
      event.preventDefault();
      this.$router.push('/');
    },
    addScrollEventListener() {
      let isScrolling;
      window.addEventListener('scroll', () => {
        clearTimeout(isScrolling);
        this.$refs.floatingTimeLabel.style.opacity = '1';
        
        const cards = this.$el.querySelectorAll('.card');
        let visibleCard = null;
        
        cards.forEach(card => {
          const rect = card.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            visibleCard = card;
          }
        });
        
        if (visibleCard) {
          const dateTime = visibleCard.querySelector('.card-datetime').textContent;
          this.$refs.floatingTimeLabel.textContent = dateTime;
        }
        
        isScrolling = setTimeout(() => {
          this.$refs.floatingTimeLabel.style.opacity = '0';
        }, 1500);
      });
    }
  }
}
</script>

<style scoped>
/* You can add any needed styles here */
</style>