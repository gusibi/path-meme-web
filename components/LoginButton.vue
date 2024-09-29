<template>
  <div>
    <button v-if="!isAuthenticated" @click="login">Login with GitHub</button>
    <div v-else>
      <p>Welcome, {{ user.name }}!</p>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>
<script setup>
import { useAuth0 } from '@auth0/auth0-vue'

const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0()

const login = () => {
  loginWithRedirect({
    connection: 'github'
  })
}
</script>