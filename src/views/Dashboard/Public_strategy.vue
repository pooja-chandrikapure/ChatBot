<template>
  <div class="flex-1 p-2 md:p-4">
    <h1 class="text-2xl font-semibold mb-4">Public Strategies</h1>

    <!-- Search -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4"
    >
      <input
        type="text"
        v-model="searchInput"
        placeholder="Search Public strategy name..."
        class="w-full md:w-64 px-3 md:px-4 py-2 border rounded-lg
               focus:outline-none focus:ring-2 focus:ring-blue-500
               text-sm md:text-base"
      />
    </div>

    <!-- States -->
    <div v-if="loading">Loading...</div>

    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>

    <!-- Strategy Grid -->
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="strategy in filteredStrategies"
          :key="strategy.id"
          class="border p-4 rounded"
        >
          <h2 class="font-semibold">{{ strategy.name }}</h2>
          <p class="text-sm text-gray-600">{{ strategy.description }}</p>
          <p class="text-sm">Capital: {{ strategy.capital_required }}</p>
          <p class="text-sm">Owner: {{ strategy.owner_name }}</p>

          <button
            @click="askQuestion(strategy)"
            :disabled="loadingStrategyId === strategy.id"
            class="bg-gray-400 p-1 rounded-sm text-black mt-2 text-sm"
          >
            <span
              v-if="loadingStrategyId === strategy.id"
              class="inline-block w-4 h-4 border-2 border-black
                     border-t-transparent rounded-full animate-spin"
            ></span>

            <span v-else>Ask Question</span>
          </button>
        </div>
      </div>

      <!-- No results -->
      <p
        v-if="!filteredStrategies.length && debouncedQuery"
        class="text-center text-gray-500 mt-6"
      >
        No strategies found
      </p>
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
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import { publicStrategyStore } from '../../stores/public_strategy'
import { useTestChatStore } from '../../stores/chatList'

const router = useRouter()

/* ---------------- Stores ---------------- */
const publicStrategy = publicStrategyStore()
const { strategies, loading, error, pagination } = storeToRefs(publicStrategy)

const chatStore = useTestChatStore()

/* ---------------- Search (Debounced) ---------------- */
const searchInput = ref('')
const debouncedQuery = ref('')
let debounceTimer = null

watch(searchInput, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = val.trim()
  }, 300)
})

const filteredStrategies = computed(() => {
  if (!debouncedQuery.value) return strategies.value

  return strategies.value.filter((strategy) =>
    strategy.name
      .toLowerCase()
      .includes(debouncedQuery.value.toLowerCase())
  )
})

/* ---------------- Chat ---------------- */
const loadingStrategyId = ref(null)

const askQuestion = async (strategy) => {
  try {
    loadingStrategyId.value = strategy.id

    const chat = await publicStrategy.startChat(
      strategy.id,
      strategy.owner_id
    )

    await chatStore.fetchChats()

    router.push({
      name: 'Chat',
      params: { chatId: chat.chat_id },
    })
  } catch (err) {
    console.error('Failed to start chat:', err)
  } finally {
    loadingStrategyId.value = null
  }
}

/* ---------------- Init ---------------- */
onMounted(() => {
  publicStrategy.fetchPublicStrategies(1, 10)
})
</script>
