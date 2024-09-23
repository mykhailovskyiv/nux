<script setup>
import {computed} from "vue";
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => {
  return authStore.user
})

const logout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="header">
    <div v-if="user" class="header-login">
      <div class="header-login-info">
        <p class="header-login-title">
          <span class="header-login-label">Name:</span> {{ user.name }}
        </p>
        <p class="header-login-title">
          <span class="header-login-label">Email:</span> {{ user.email }}
        </p>
        <p class="header-login-title">
          <span class="header-login-label">Company:</span> {{ user.company.name }}
        </p>
      </div>
      <button class="header-login-button" @click="logout">Logout</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 60px;
  background: #333;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  &-login {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    &-info {
      display: flex;
      color: white;
      margin-right: 20px;
    }
    &-title {
      font-size: 14px;
      margin: 4px 5px;
    }
    &-label {
      font-weight: bold;
      margin-right: 5px;
    }
    &-button {
      background-color: #f44336;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s ease;
      &:hover {
        background-color: #d32f2f;
      }
    }
  }
}
</style>
