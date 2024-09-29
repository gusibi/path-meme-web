<template>
  <div>
    <button @click="loginWithGitHub">Log in with GitHub</button>
  </div>
</template>
<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

const { loginWithRedirect } = useAuth0()

const loginWithGitHub = () => {
  loginWithRedirect({
    authorizationParams: {
      connection: 'github'
    }
  })
}
</script>