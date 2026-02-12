<template>
  <div class="flex flex-col bg-gradient-to-br from-white to-gray-50 md:mt-0 mt-1 h-[100vh] min-h-screen">
    <!-- Header -->
    <div class="p-5 sm:p-5 border-b bg-white/80 backdrop-blur-sm font-bold text-2xl shrink-0 shadow-sm">
      <div class="flex items-center gap-2">
        <div class="w-1 h-8 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full"></div>
        <span class="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Chats</span>
      </div>
    </div>

    <!-- Chat list -->
    <div class="flex-1 overflow-y-auto">
      <div
        v-for="chat in chats"
        :key="chat.id"
        @click="onChatClick(chat)"
        class="flex items-center gap-3.5 p-3.5 sm:p-4 cursor-pointer 
        hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-green-50/50
        active:bg-emerald-100/30 transition-all duration-200 ease-in-out
        border-b border-gray-100 hover:border-emerald-100
        group relative"
      >
        <!-- Avatar -->
        <div class="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 
        text-white flex items-center justify-center font-semibold text-lg uppercase shrink-0 
        shadow-md group-hover:shadow-lg transition-shadow">
          {{ chat.strategy_name.slice(0,1) }}
        </div>

        <!-- Chat info -->
        <div class="flex-1 min-w-0">
          <div class="flex justify-between items-start gap-2">
            <div class="min-w-0 flex-1">
              <p class="font-semibold truncate text-base sm:text-lg text-gray-900 group-hover:text-emerald-700 transition-colors">
                {{ chat.strategy_name }}
              </p>
              <p class="text-sm truncate text-gray-600 mt-0.5">
                {{ getChatDisplayName(chat) }}
              </p>
            </div>
            
            <!-- Time and badge -->
            <div class="flex flex-col items-end gap-1.5 shrink-0">
              <span class="text-xs text-gray-500 font-medium">
                {{ formatTime(chat.updated_at) }}
              </span>
              <span
                v-if="chat.unread_count > 0"
                class="bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-semibold 
                px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-sm animate-pulse"
              >
                {{ chat.unread_count }}
              </span>
            </div>
          </div>

          <p class="text-sm text-gray-600 truncate mt-2 group-hover:text-gray-700 transition-colors">
            {{ chat.last_message || 'No messages yet' }}
          </p>
        </div>

        <!-- Hover indicator -->
        <div class="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="chats.length === 0" class="flex flex-col items-center justify-center p-12 text-center">
        <div class="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center mb-4">
          <svg class="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </div>
        <p class="text-gray-600 font-medium">No chats yet</p>
        <p class="text-sm text-gray-500 mt-1">Start a conversation to get started</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useChatStore } from '../../stores/chat';
import { useTestChatStore } from '../../stores/chatList';
import { useAuthStore } from '../../stores/auth';

const chatStore = useTestChatStore()
const chatSocketStore = useChatStore();
const { chats } = storeToRefs(chatStore)
const authStore = useAuthStore()
const myId = computed(() => Number(authStore.profile?.id))
const emit = defineEmits(['open-chat'])

const getChatDisplayName = (chat) => {
  console.log('Chat:', chat);
  console.log("vcbnmmb", myId.value)
  return Number(chat.creator_id) === myId.value ? chat.user_name : chat.creator_name
}

const handleNewMessage = (message) => {
  console.log('New message:', message);

  const chat = chats.value.find(chat => chat.id === message.chat_id);

  if (chat) {
    chat.last_message = message.content;
    chat.updated_at = message.created_at;

    if(!chatSocketStore.currentChatId || chatSocketStore.currentChatId !== message.chat_id) {
      chat.unread_count = (chat.unread_count || 0) + 1;
    }
    const index = chats.value.indexOf(chat);
    if (index > 0){
      chats.value.splice(index, 1);
      chats.value.unshift(chat);
    }
  } else {
    chatStore.fetchChats();
  }
};

onMounted(async() => {
  await chatStore.fetchChats();
  await chatStore.fetchUnreadCounts();
  if (chatSocketStore.socket) {
    chatSocketStore.socket.on('message', handleNewMessage);
  }
});

const onChatClick = (chat) => {
  console.log('adasrh',chat.id)
  
  chatStore.markAsReadApiStore(chat.id);
  chat.unread_count = 0;
  emit('open-chat', chat);
}

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>