<template>
  <div class="flex flex-col h-full bg-gray-50">
    <!-- Header -->
    <div class="p-4 border-b bg-green-100 flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
        {{ chat.strategy_name.slice(0,1) }}
        <div class="p-4 bg-black border-b font-semibold">
        {{ chat.chat_id }}
      </div>
      </div>
      <div>
        <p class="font-semibold">{{ chat.creator_name }}</p>
        <!-- <p class="text-xs text-gray-500">Chat ID {{ chat.chat_id }}</p> -->
      </div>
    </div>

    <!-- Messages (dummy for now) -->
    <div class="flex-1 p-4 overflow-y-auto space-y-2 bg-green-100">
      <div class="self-start bg-white p-2 rounded shadow text-sm">
        {{ chat.last_message }}
      </div>
      <div
      v-for="msg in messages"
      :key="msg.message_id"
      class ="flex"
      :class="msg.sender_id === authStore.user?.id ? 'justtify-end' :'justify-start'"
      >
      <div
      class="max-w-xs px-3 py-2 rounded-lg text-sm break-words"
      :class="msg.sender_id === authStore.user?.id
      ? 'bg-blue-500 text-white rounded-br-none'
      : 'bg-white text-black rounded-bl-none'">
      {{ msg.content }}
      </div>
      </div>
    </div>

    <!-- Input box -->
    <div class="p-3 border-t bg-white flex gap-2">
      <input
        type="text"
        v-model="messageText"
        placeholder="Type a message"
        class="flex-1 border rounded-full px-4 py-2 focus:outline-none"
      />
      <button
      @click="handleSend"
      class="bg-green-500 text-white px-4 rounded-full">
        Send
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
import socket from '../../services/socket';
// import socket from '../../services/socket';

const authStore = useAuthStore();
const props = defineProps({
  chat: {
    type: Object,
    required: true,
  },
})
const msgStore = useTestChatStore()  //chatStore
const socketStore = useChatStore()   //authStore
const { messages } = storeToRefs(msgStore)
const {lastMessage} = storeToRefs(socketStore)
const messageText = ref('')

const loading = ref(false);
const chatId = 5;
const role = "user"; //or "creator"

onMounted(() => {
  socketStore.initChat({ chat_id: chatId, role: "user"}); //role: props.chat.role
});

onUnmounted(() => {
  socketStore.leaveChat();
  // socketStore.disconnSocket();
});
const scrollToBottom = () => {
  const el = document.querySelector(".overflow-y-auto");
  if (el) {
    el.scrollTop = el.scrollHeight;
  }
};
// onUnmounted(() => {
//   socket.disconnect();
// })

watch(lastMessage , () => {
  if(lastMessage.value != null)
{
  messages.value.push(lastMessage.value)
}
})

watch(
  () => props.chat.chat_id,
  async (id) => {
    if (id) {
      await msgStore.fetchMessages(id)
      nextTick(scrollToBottom)
    }
  },
  { immediate: true}
)


const handleSend = async () => {
  if (!messageText.value.trim()) return
  // if (!messageInput.value.trim()) return;

  loading.value = true;

  // socketStore.sendMessage(messageText.value);
  
  // messageInput.value = "";
  
  await msgStore.sendMessage(
    props.chat.chat_id,
    messageText.value
  )

  messageText.value = '';

  nextTick(scrollToBottom)
}

</script>