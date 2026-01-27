<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Public Strategies</h1>

    <div v-if="loading">Loading...</div>

    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>

    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="strategy in strategies"
          :key="strategy.id"
          class="border p-4 rounded"
        >
          <h2 class="font-semibold">{{ strategy.name }}</h2>
          <p>{{ strategy.description }}</p>
          <p>Capital: {{ strategy.capital_required }}</p>
          <p>Owner Name: {{ strategy.owner_name }}</p>


          <button
            @click="askQuestion(strategy)"
            :disabled="loadingStrategyId === strategy.id"
            class="bg-gray-400 p-1 rounded-sm text-black mt-2"
          >
          <span v-if="loadingStrategyId === strategy.id"
          class="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin">
            Opening chat...
          </span>
          <span v-else>
            Ask Question
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex gap-2 mt-4">
      <button
        :disabled="pagination.page === 1"
        @click="publicStrategy.fetchPublicStrategies(pagination.page - 1)"
        class="px-3 py-1 bg-gray-200 rounded"
      >
        Prev
      </button>

      <span>
        Page {{ pagination.page }} of {{ pagination.total_pages }}
      </span>

      <button
        :disabled="pagination.page === pagination.total_pages"
        @click="publicStrategy.fetchPublicStrategies(pagination.page + 1)"
        class="px-3 py-1 bg-gray-200 rounded"
      >
        Next
      </button>
    </div>
  </div>
</template>


<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

import { publicStrategyStore } from '../../stores/public_strategy'
import { useTestChatStore } from '../../stores/chatList'

const router = useRouter()

// Strategy store
const publicStrategy = publicStrategyStore()
const {
  strategies,
  loading,
  error,
  pagination,
} = storeToRefs(publicStrategy)

// Chat store
const chatStore = useTestChatStore()
const loadingStrategyId = ref(null  )

onMounted(() => {
  publicStrategy.fetchPublicStrategies(1, 10)
})

const askQuestion = async (strategy) => {
  try {
    loadingStrategyId.value = strategy.id
    console.log(strategy)
    const chat = await publicStrategy.startChat(
      strategy.id,
      strategy.owner_id,
      // strategy.creator_id
    )

    // refresh chat list
    await chatStore.fetchChats()

    // redirect to chat page
    router.push({name: 'Chat',
      params: { chatId: chat.chat_id },
    })
  } catch (error) {
    console.error('Failed to start chat:', error.message)
  }
}
</script>
