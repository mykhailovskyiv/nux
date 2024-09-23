<script setup>
import LoginForm from "../components/LoginForm.vue";

import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'
import {onMounted} from "vue";

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (authStore.user) {
    router.push({ name: 'home' })
  }
})
</script>

<template>
 <div class="login">
   <LoginForm/>
 </div>
</template>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  width: 80%;
  margin-top: 30px;
}
@media (max-width: 1020px) {
  .login {
    width: 80%;
  }
}

</style>
