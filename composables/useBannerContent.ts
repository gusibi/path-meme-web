import { ref } from 'vue'

export const useBannerContent = () => {
    const bannerContent = ref('')

    const setBannerContent = (content: string) => {
        bannerContent.value = content
    }

    return {
        bannerContent,
        setBannerContent
    }
}