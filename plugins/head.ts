export default defineNuxtPlugin((nuxtApp) => {
    useHead({
        meta: [
            {
                name: 'baidu-site-verification',
                content: 'codeva-SAHZtLhbiF'
            }
            //     {
            //         name: 'google-site-verification',
            //         content: 'mK8IcUVJNhs8X6Fwy-cJCB9AEIqxFbLOsKvynUoqa3Y'
            //     }
        ]
    })
})