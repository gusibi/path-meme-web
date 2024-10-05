import { ref, provide, inject } from 'vue'

const bannerContentSymbol = Symbol('bannerContent')

export function useBannerContent() {
    const bannerContent = ref('')
    const bannerImageUrl = ref('/banner2.jpeg') // 默认背景图

    const setBannerContent = (content: string) => {
        bannerContent.value = content
    }

    const setBannerImage = (url: string) => {
        bannerImageUrl.value = url
    }

    provide(bannerContentSymbol, {
        bannerContent,
        bannerImageUrl,
        setBannerContent,
        setBannerImage
    })

    return {
        bannerContent,
        bannerImageUrl,
        setBannerContent,
        setBannerImage
    }
}

export function useBannerContentInjection() {
    const bannerContext = inject(bannerContentSymbol)
    if (!bannerContext) {
        throw new Error('useBannerContentInjection must be used within a component that has called useBannerContent')
    }
    return bannerContext
}