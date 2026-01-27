<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b font-extrabold text-xl">
      Chats
    </div>

    <!-- Chat list -->
    <div class="flex-1 overflow-y-auto">
      <div
        v-for="chat in chats"
        :key="chat.chat_id"
        @click= "onChatClick(chat)"
        class="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100"
      >
        <!-- Avatar -->
        <div class="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold uppercase">
          {{ chat.strategy_name.slice(0,1) }}
          <!-- {{ chat.creator_name }} -->
        </div>

        <!-- Chat info -->
        <div class="flex-1 min-w-0  ">
          <div class="flex justify-between ">
            <div class="flex justify-between grid grid-cols-1">
            <p class="font-bold truncate text-lg">
              {{ chat.strategy_name }}
            </p>
            <!-- <div class="flex justify-between"> -->
            <p class="text-sm truncate">
              {{ chat.creator_name }}
            </p>
            </div>
            <!-- <span class="">{{ chat.creator_name }}</span> -->
            <div class="flex flex-col items-end gap-1">
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

          <p class="text-sm text-gray-600 truncate">
            {{ chat.last_message || 'No messages yet' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useChatStore } from '../../stores/chat';
import { useTestChatStore } from '../../stores/chatList';

const chatStore = useTestChatStore()
const chatSocketStore = useChatStore();
const { chats } = storeToRefs(chatStore)
const emit = defineEmits(['open-chat'])
onMounted(async() => {
    await chatStore.fetchChats();
    await chatStore.fetchUnreadCounts();
    // await chatStore.getUnreadCountApiStore();
})

const onChatClick = (chat) => {
  // chatStore.openChat(chat);
  chatSocketStore.initChat({ chat_id: chat.chat_id, role: "user"});
  chatStore.markAsReadApiStore(chat.chat_id);
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