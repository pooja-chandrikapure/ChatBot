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
      <div
        v-for="chat in chats"
        :key="chat.chat_id"
        class="border rounded p-3 mb-2 hover:bg-gray-50 cursor-pointer"
        @click="openChat(chat)"
      >
        <div class="flex justify-between">
          <div>
            <p class="font-medium">
              Strategy ID: {{ chat.strategy_id }}
            </p>
            <p class="text-sm text-gray-600 truncate">
              <!-- {{ chat.last_message || 'No messages yet' }} -->
            </p>
          </div>

          <span class="text-xs text-gray-400">
            <!-- {{ formatDate(chat.updated_at) }} -->chat
          </span>
        </div>
      </div>
    </div>
  <!-- </div> -->
</template>
<script setup>

import { onMounted } from 'vue';

import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import ChatList from './ChatList.vue';
import ChatBox from './ChatBox.vue';

const activeChat = ref(null)

const openChat = (chat) => {
  activeChat.value = chat
}

const router = useRouter();


</script>