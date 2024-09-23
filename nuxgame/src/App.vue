<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
</script>

<template>
<Header/>
  <RouterView />
</template>

<style>
 body {
   margin: 0;
   overflow-x: hidden;
   font-family: 'Arial', sans-serif;
   font-size: 16px;
   line-height: 1.5;
   background-color: #545454;
   color: #333;
   min-height: 100vh;
 }

 #app {
   width: 100%;
   overflow-x: hidden;
   display: flex;
   flex-direction: column;
   align-items: center;
   min-height: 100vh;
 }
</style>
