<script setup>
import { onMounted } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import toast from './components/toast.vue';
import { useChatStore } from './stores/chat';
import socket from './services/socket';
// const chatStore = useChatStore();
// const props = defineProps({ 
//   chat: Object 
// });
// const onMessage = (data) => {
//   console.log("global message received:", data);
// };

// onMounted(() => {
//   chatStore.initChat({
//     chat_id: props.chat.chat_id,
//     role: "user"
//   });
//   if (localStorage.getItem("token")) {
//     socket.connect();
//   }
// });

</script>

<template>
  <router-view />
  <toast />
</template>

<style scoped>

</style>
