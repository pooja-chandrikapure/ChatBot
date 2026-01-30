<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="p-2 sm:p-1.5 border-b bg-white flex items-center gap-3 shrink-0">
      <button
        class="md:hidden mr-2 text-gray-600"
        @click="$emit('back')"
      >
        ←
      </button>
      <div class="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
        {{ chat.strategy_name.slice(0,1) }}
        <!-- <div class="p-4 bg-black border-b font-semibold">
        {{ chat.chat_id }}
      </div> -->
      </div>
      <div>
        <p class="font-bold">{{ chat.strategy_name }}</p>
        <p class="font-normal">{{ getChatDisplayName(chat) }}</p>
        <!-- <p class="text-xs text-gray-500">Chat ID {{ chat.chat_id }}</p> -->
      </div>
    </div>

    <!-- Messages (dummy for now) -->
    <div ref="chatBody"
    class="flex-1 p-2 sm:p-4 overflow-y-auto space-y-2 bg-white">
      <!-- <div class="self-end bg-white p-2 rounded shadow text-sm ">
        {{ chat.last_message }}
      </div> -->
      <!-- {{authStore}} -->
      <div
      v-for="msg in messages"
      :key="msg.message_id"
      class ="flex"
      :class="Number(msg.sender_id) == currentUserId ? 'justify-end' :'justify-start'"
      >
      <!-- <p class="text-xs text-red-500">
      sender: {{ msg.sender_id }} | me: {{ currentUserId }}
    </p> -->
      <div
      class="max-w-[80%] sm:max-w-xs px-3 py-2 rounded-lg text-sm break-words shadow "
      :class="Number(msg.sender_id) === currentUserId
      ? 'bg-green-200 text-black rounded-br-none'
      : 'bg-gray-200 text-black rounded-bl-none'">
      {{ msg.content }} 
      <!-- 🔥 READ STATUS (ONLY FOR MY MESSAGES) -->
      <div
        v-if="Number(msg.sender_id) === currentUserId"
        class="text-[11px] text-right mt-1 flex justify-end"
      >
        <span
          v-if="msg.is_read"
          class="text-blue-400 font-semibold"
        >
        <img src="/tick-blue.svg  " alt=""
          class="w-10 h-5 border-black"/>
          <!-- ✓✓ -->
        </span>
        <span
          v-else
          class="text-gray/80"
        >
        <img src="/tick-black.svg  " alt=""
          class="w-10 h-5 border-black"/>
          <!-- ✓ -->
        </span>
      </div>
      </div>
      </div>
    </div>

    <!-- Input box -->
    <div class="p-2 sm:p-3 border-t bg-white flex gap-2 item-center shrink-0">
      <input
        type="text"
        v-model="messageText"
        placeholder="Type a message"
        class="flex-1 border rounded-full px-4 py-2 
        focus:outline-none focus:ring-1 focus:ring-blue-400"
      />
      <button
  @click="handleSend"
  :disabled="loading"
  class="bg-green-500 text-white px-4 py-2 rounded-full flex items-center justify-center min-w-[70px]
         disabled:opacity-60 disabled:cursor-not-allowed"
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
const chatId = computed(() => props.chat.chat_id);
const role = "user"; //or "creator"
const currentUserId = computed(() => Number(authStore.profile?.id));
const myId = computed(() => Number(authStore.profile?.id));
// onMounted(() => {
//   socketStore.initChat({ chat_id: chatId.value, role: "user"}); 
// });
const getChatDisplayName = (chat) => {
  return Number(chat.creator_id) === myId.value
    ? chat.user_name
    : chat.creator_name
}

onUnmounted(() => {
  socketStore.leaveChat();
  // socketStore.disconnSocket();
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
// onUnmounted(() => {
//   socket.disconnect();
// })

watch(lastMessage , () => {
  if(lastMessage.value != null)
{
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
  // if (!messageInput.value.trim()) return;

  loading.value = true;

  // socketStore.sendMessage(messageText.value);
  
  // messageInput.value = "";
  
  
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