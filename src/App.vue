<script setup>
import { onMounted } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import toast from './components/toast.vue';
import { useChatStore } from './stores/chat';
import socket from './services/socket';

</script>

<template>
  <router-view />
  <toast />
</template>

<style scoped>

</style>
