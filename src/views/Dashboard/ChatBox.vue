<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 h-[100vh] md:mt-0 mt-1">
    <!-- Header -->
    <div class="p-3.5 sm:p-3.5 border-b bg-white/80 backdrop-blur-sm flex items-center gap-3 shrink-0 shadow-sm">
      <button
        class="md:hidden mr-2 text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full"
        @click="$emit('back')"
      >
        ←
      </button>
      <div class="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center font-semibold text-lg shadow-md">
        {{ chat.strategy_name.slice(0,1) }}
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-semibold text-gray-900 truncate">{{ chat.strategy_name }}</p>
        <p class="text-sm text-gray-600 truncate">{{ getChatDisplayName(chat) }}</p>
      </div>
    </div>

    <!-- Messages -->
    <div ref="chatBody"
    class="flex-1 p-3 sm:p-5 overflow-y-auto space-y-3 relative"
  :style="{
    backgroundImage: 'url(/png/chat_bg.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }">
      <div
      v-for="msg in messages"
      :key="msg.message_id"
      class="flex animate-fadeIn"
      :class="Number(msg.sender_id) == currentUserId ? 'justify-end' :'justify-start'"
      >
      <div
      class="max-w-[80%] sm:max-w-md px-4 py-2.5 rounded-2xl text-sm break-words shadow-sm transition-all hover:shadow-md"
      :class="Number(msg.sender_id) === currentUserId
      ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-br-sm'
      : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'">
      <p class="leading-relaxed">{{ msg.content }}</p>
      
      <!-- Read Status -->
      <div
        v-if="Number(msg.sender_id) === currentUserId"
        class="flex justify-end items-center mt-1.5 gap-1"
      >
        <span class="text-[10px] text-white/70">
          {{ formatMessageTime(msg.created_at) }}
        </span>
        <img 
          :src="msg.is_read ? '/tick-blue.svg' : '/tick-black.svg'" 
          alt="read status"
          class="w-4 h-4 "
          :class="msg.is_read ? 'text-blue-300' : 'text-gray-400'"
        />
      </div>
      <div v-else class="text-[10px] text-gray-500 text-right mt-1.5">
        {{ formatMessageTime(msg.created_at) }}
      </div>
      </div>
      </div>
    </div>

    <!-- Input box -->
    <div class="p-3 sm:p-4 border-t bg-white/80 backdrop-blur-sm flex gap-2.5 items-center shrink-0 shadow-lg">
      <input
        type="text"
        v-model="messageText"
        @keyup.enter="handleSend"
        placeholder="Type a message..."
        class="flex-1 border border-gray-200 rounded-full px-5 py-2.5 text-sm
        focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent
        bg-gray-50 transition-all placeholder:text-gray-400"
      />
      <button
        @click="handleSend"
        :disabled="loading"
        class="bg-gradient-to-br from-emerald-500 to-green-600 text-white px-5 py-2.5 rounded-full 
        flex items-center justify-center min-w-[80px] font-medium shadow-md
        hover:shadow-lg hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        transition-all duration-200"
      >
        <span v-if="!loading">Send</span>

        <svg
          v-else
          class="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted, onUnmounted, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import { useTestChatStore } from '../../stores/chatList';
import { useChatStore } from '../../stores/chat';
import { useAuthStore } from '../../stores/auth';
import { computed } from 'vue';
import socket from '../../services/socket';

const authStore = useAuthStore();
const props = defineProps({
  chat: {
    type: Object,
    required: true,
  },
})
const msgStore = useTestChatStore()
const socketStore = useChatStore()
const { messages } = storeToRefs(msgStore)
const {lastMessage} = storeToRefs(socketStore)
const messageText = ref('')

const loading = ref(false);
const chatId = computed(() => props.chat.chat_id);
const role = "user";
const currentUserId = computed(() => Number(authStore.profile?.id));
const myId = computed(() => Number(authStore.profile?.id));

const getChatDisplayName = (chat) => {
  return Number(chat.creator_id) === myId.value
    ? chat.user_name
    : chat.creator_name
}

onUnmounted(() => {
  socketStore.leaveChat();
});

const chatBody = ref(null);

const scrollToBottom = () => {
  if (chatBody.value) {
    chatBody.value.scrollTo({
      top: chatBody.value.scrollHeight,
      behavior: 'smooth'
    })
  }
};

const formatMessageTime = (dateStr) => {
  if (!dateStr) return '';

  const date = new Date(dateStr);

  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',   // FORCE IST
  });
};

watch(lastMessage , () => {
  if(lastMessage.value != null) {
    console.log('lastmessgae', lastMessage.value)
    messages.value.push(lastMessage.value)
  }
})

watch(
  () => props.chat.id,
  async (id) => {
    if (id) {
      await msgStore.fetchMessages(id)
      nextTick(scrollToBottom)
    }
  },
  { immediate: true}
)

const handleSend = async () => {
  if (!messageText.value.trim() || loading.value) return
  
  loading.value = true;
  
  try {
    await msgStore.sendMessage(
      props.chat.id,
      messageText.value
    )

    messageText.value = ''
    nextTick(scrollToBottom)
  } catch (err) {
    console.error('Send failed', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>