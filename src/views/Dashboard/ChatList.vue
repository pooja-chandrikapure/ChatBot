<template>
  <div class="h-[100vh] sm:h-full flex flex-col bg-white">
    <!-- Header -->
    <div class="p-4.5 sm:p-4 border-b font-extrabold text-xl shrink-0">
      Chats
    </div>

    <!-- Chat list -->
    <div class="flex-1 overflow-y-auto h-[120vh]">
      <div
        v-for="chat in chats"
        :key="chat.id"
        @click= "onChatClick(chat)"
        class="flex items-center gap-3 p-3 sm:p-4 cursor-pointer hover:bg-gray-100 
        active:bg-gray-200 transition-colors duration-200 ease-in-out"
      >
        <!-- Avatar -->
        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500 text-white 
        flex items-center justify-center font-bold uppercase shrink-0">
          {{ chat.strategy_name.slice(0,1) }}
          <!-- {{ chat.creator_name }} -->
        </div>

        <!-- Chat info -->
        <div class="flex-1 min-w-0  ">
          <div class="flex justify-between ">
            <div class="min-w-0">
            <p class="font-bold truncate text-lg text-base sm:text-lg">
              {{ chat.strategy_name }}
            </p>
            <!-- <div class="flex justify-between"> -->
            <p class="text-sm truncate text-gray-600">
              {{ getChatDisplayName(chat) }}
            </p>
            </div>
            <!-- <span class="">{{ chat.creator_name }}</span> -->
            <div class="flex flex-col items-end gap-1 shrink-0">
            <span class="text-xs text-gray-400">
              {{ formatTime(chat.updated_at) }}
            </span>
             <span
          v-if="chat.unread_count > 0"
          class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
        >
          {{ chat.unread_count }}
        </span>
            </div>
          </div>

          <p class="text-sm text-gray-600 truncate mt-1">
            {{ chat.last_message || 'No messages yet' }}
          </p>
        </div>
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
    
    // await chatStore.getUnreadCountApiStore();
});

const onChatClick = (chat) => {

  // chatStore.openChat(chat);
  console.log('adasrh',chat.id)
  
  // chatSocketStore.initChat({ chat_id: chat.id, role: "user"});

  // chatSocketStore.markMessagesAsRead({ chat_id: chat.chat_id,
  //   sender_id: chat.other_user_id,
  //   receiver_id: chat.receiver_id
  //  });
  chatStore.markAsReadApiStore(chat.id);
  chat.unread_count = 0;
  emit('open-chat', chat);
  // chatStore.markAsReadApiStore(chat.chat_id);
}

const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

</script>