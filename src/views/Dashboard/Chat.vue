<template>
  <!-- <div class="p-4"> -->
    <!-- <h1 class="text-xl font-semibold mb-4">Chats</h1> -->
    <div class="h-screen flex bg-gray-100">
      <!-- Left: Chat list -->
    <ChatList
      class="w-full md:w-1/3 border-r bg-white"
      @open-chat="openChat"
    />
    <!-- Right: Chat box -->
    <ChatBox
      v-if="activeChat"
      class="hidden md:flex flex-1"
      :chat="activeChat"
    />

     <!-- Mobile empty state -->
    <div
      v-else
      class="hidden md:flex flex-1 items-center justify-center text-gray-400"
    >
      Select a chat to start messaging
    </div>
    </div>
    <!-- Loading -->
    <div v-if="loading">Loading chats...</div>

    <!-- Error -->
    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>

    <!-- Chat List -->
    <div v-else>
      <!-- <div
        v-for="chat in chats"
        :key="chat.chat_id"
        class="border rounded p-3 mb-2 hover:bg-gray-50 cursor-pointer"
        @click="openChat(chat)"
      >
      </div> -->
    </div>
  <!-- </div> -->
</template>
<script setup>

import { onMounted, watch } from 'vue';

import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { ref } from 'vue';
import ChatList from './ChatList.vue';
import ChatBox from './ChatBox.vue';
import { useTestChatStore } from '../../stores/chatList';
const route = useRoute();
const chatStore = useTestChatStore()
const { chats , loading, error } = storeToRefs(chatStore)
const activeChat = ref(null)

const openChat = (chat) => {
  activeChat.value = chat
}
// const openChatById = async (chatId) => {
//   if(!chatId) return
//   // const chat = chats.value.find(chat => chat.chat_id === chatId);
//   if (!chatStore.chats || !chatStore.chatslength) {
//     await chatStore.fetchChats();
//   }
//   const foundChat = chatStore.chats.find(c => String(c.chat_id) === String(chatId));
//   if (foundChat) {
//     activeChat.value = foundChat;
//   }
  
// }

// onMounted(() => {
//   openChatById(route.params.chatId);
// })
// watch(
//   () => route.params.chatId,
//   (newId) => openChatById(newId)
// )
const router = useRouter();


</script>