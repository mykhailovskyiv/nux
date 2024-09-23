<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const username = ref<string>('');
const phoneNumber = ref<string>('');

const usernameError = ref<string>('');
const phoneError = ref<string>('');

const error = computed<string | null>(() => authStore.error);

const validateUsername = (): void => {
  username.value = username.value.replace(/[^a-zA-Zа-яА-ЯіІїЇєЄ]/g, '');
  usernameError.value = username.value === '' ? 'Username can only contain letters.' : '';
};

const validatePhoneNumber = (): void => {
  phoneNumber.value = phoneNumber.value.replace(/[^\d+() -]/g, '');
  phoneError.value = phoneNumber.value === '' ? 'Phone number cannot be empty.' : '';
};

const submitForm = (): void => {
  validateUsername();
  validatePhoneNumber();

  if (!usernameError.value && !phoneError.value) {
    console.log('Form submitted:', { username: username.value, phone: phoneNumber.value });
    authStore.login(username.value, phoneNumber.value).then(() => {
      router.push({ name: 'home' });
    }).catch((err: unknown) => {
      console.error('Login failed:', err);
    });
  } else {
    console.log('Form has validation errors.');
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-header">
      <h5>Register</h5>
    </div>
    <form @submit.prevent="submitForm" class="login-form">
      <p v-if="error" style="color:red">{{ error }}</p>
      <p>Enter form</p>
      <div class="login-form-input">
        <input
            id="username"
            v-model="username"
            type="text"
            @input="validateUsername"
            placeholder="Enter your username"
        />
        <p v-if="usernameError" style="color:red">{{ usernameError }}</p>
      </div>

      <div class="login-form-input">
        <input
            id="phone"
            v-model="phoneNumber"
            type="text"
            @input="validatePhoneNumber"
            placeholder="Enter your phone number"
        />
        <p v-if="phoneError" style="color:red">{{ phoneError }}</p>
      </div>

      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<style scoped lang="scss">
 .login-container {
   width: 800px;
   display: flex;
   flex-direction: column;
   align-items: center;
   background-color: #C3C3C3;
   border-radius: 5px;
 }
 .login-header {
   background-color: #A5A5A5;
   width: 100%;
   text-align: center;
   border-radius: inherit;
 }
 .login-form {
   width: 90%;
   &-input {
     width: 100%;
     input {
       width: 95%;
       height: 41px;
       gap: 10px;
       border-radius: 5px;
       border-color: transparent;
       margin-bottom: 20px;
       padding-block: 0;
       padding-inline: 0;
       border-width: 0;
       padding-left: 5%
     }
   }
   button {
     width: 100%;
     height: 41px;
     gap: 10px;
     border-radius: 5px;
     margin-bottom: 30px;
     background-color: #519945;
     border-color: transparent;
     color: white;
   }
 }
 @media (max-width: 1020px) {
   .login-container {
     width: 100%;
   }
 }

</style>
