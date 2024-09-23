<script setup>
import {computed, onMounted} from "vue";
import TodoList from "../components/TodoList.vue";
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

 onMounted(() => {
   if (!authStore.user) {
     router.push({ name: 'login' })
   }
   authStore.fetchTodos()
 })
</script>

<template>
  <div class="home">
    <TodoList/>
  </div>
</template>

<style scoped>
 .home {
   margin-top: 30px;
   width: 100%;
 }
</style>
