import { ref, provide, inject } from 'vue'

const bannerContentSymbol = Symbol('bannerContent')

export function useBannerContent() {
    const bannerContent = ref('')
    const bannerImageUrl = ref('/banner2.jpeg') // 默认背景图
    const showBanner = ref(true) // 新增：默认显示 banner
    // console.log('Initial values:', { content: bannerContent.value, image: bannerImageUrl.value, show: showBanner.value })

    const setBannerContent = (content: string) => {
        bannerContent.value = content
    }

    const setBannerImage = (url: string) => {
        bannerImageUrl.value = url
    }

    const setShowBanner = (show: boolean) => { // 新增：控制 banner 显示的方法
        showBanner.value = show
    }

    const provided = {
        bannerContent,
        bannerImageUrl,
        showBanner,
        setBannerContent,
        setBannerImage,
        setShowBanner
    }

    provide(bannerContentSymbol, provided)
    return provided
}

export function useBannerContentInjection() {
    const bannerContext = inject(bannerContentSymbol)
    // console.log('Injected context:', bannerContext)
    if (!bannerContext) {
        throw new Error('useBannerContentInjection must be used within a component that has called useBannerContent')
    }
    return bannerContext
}