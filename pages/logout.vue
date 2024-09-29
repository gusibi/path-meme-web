<template>
    <div>
        <button @click="logout">Log out</button>
    </div>
</template>
<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

const { logout: auth0Logout } = useAuth0()

const logout = () => {
    auth0Logout({
        logoutParams: {
            returnTo: window.location.origin
        }
    })
}
</script>