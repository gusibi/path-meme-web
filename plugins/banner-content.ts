export default defineNuxtPlugin(() => { })

import { useState } from '#app'

export const useBannerContent = () => {
    const bannerContent = useState<string>('bannerContent', () => '')

    const setBannerContent = (content: string) => {
        bannerContent.value = content
    }

    return {
        bannerContent,
        setBannerContent
    }
}