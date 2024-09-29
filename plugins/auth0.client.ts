import { defineNuxtPlugin } from '#app'
import { createAuth0, Auth0Plugin } from '@auth0/auth0-vue'

export default defineNuxtPlugin((nuxtApp) => {
    const runtimeConfig = useRuntimeConfig()


    if (process.client) {
        const auth0 = createAuth0({
            domain: runtimeConfig.public.auth0.domain,
            clientId: runtimeConfig.public.auth0.clientId,
            authorizationParams: {
                redirect_uri: window.location.origin
            }
        })

        nuxtApp.vueApp.use(auth0)
        console.log('Auth0 plugin initialized successfully')

        return {
            provide: {
                auth0
            }
        }
    } else {
        console.log('Auth0 plugin not initialized (server-side)')
    }
})