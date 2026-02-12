<template>
  <div class="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen lg:pl-12">
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2 ">
        Public Strategies
      </h1>
      <p class="text-gray-600">
        Explore and connect with trading strategies from our community
      </p>
    </div>

    <!-- Search Bar -->
    <div class="mb-6">
      <div class="relative max-w-md">
        <input
          type="text"
          v-model="searchInput"
          placeholder="Search strategies..."
          class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 bg-white shadow-sm transition duration-200"
        />
        <svg
          class="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="flex flex-col items-center gap-3">
        <div
          class="w-12 h-12 border-4 border-blue-500 border-t-transparent 
                 rounded-full animate-spin"
        ></div>
        <p class="text-gray-600">Loading strategies...</p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"
    >
      <div class="flex items-center gap-2">
        <svg
          class="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ error }}</span>
      </div>
    </div>

    <!-- Strategy Grid -->
    <div v-else>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
               gap-4 md:gap-6"
      >
        <div
          v-for="strategy in filteredStrategies"
          :key="strategy.id"
          class="bg-white border border-gray-200 rounded-xl p-6 
                 hover:shadow-lg transition-all duration-300 
                 hover:border-blue-300 group"
        >
          <!-- Strategy Name -->
          <h2 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {{ strategy.name }}
          </h2>

          <!-- Description -->
          <p class="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
            {{ strategy.description }}
          </p>

          <!-- Strategy Details -->
          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm">
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-gray-700 font-medium">
                {{ strategy.capital_required }}
              </span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <svg
                class="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span class="text-gray-600">{{ strategy.owner_name }}</span>
            </div>
          </div>

          <!-- Action Button -->
          <button
          @click="askQuestion(strategy)"
          :disabled="
            loadingStrategyId === strategy.id ||
            strategy.owner_id === myUserId
          "
          class="w-full bg-green-400 hover:bg-blue-700 text-white font-medium 
                py-2.5 px-4 rounded-lg transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:bg-gray-300 disabled:text-gray-600
                flex items-center justify-center gap-2
                shadow-sm hover:shadow-md"
        >
          <span v-if="strategy.owner_id === myUserId">
            Your Strategy
          </span>

          <span
            v-else-if="loadingStrategyId === strategy.id"
            class="inline-block w-4 h-4 border-2 border-white
                  border-t-transparent rounded-full animate-spin"
          ></span>

          <span v-else>
            <svg
              class="w-4 h-4 inline mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01"
              />
            </svg>
            Ask Question
          </span>
        </button>
        </div>
      </div>

      <!-- No Results -->
      <div
        v-if="!filteredStrategies.length && debouncedQuery"
        class="text-center py-16"
      >
        <svg
          class="w-16 h-16 mx-auto text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="text-gray-500 text-lg">No strategies found</p>
        <p class="text-gray-400 text-sm mt-1">
          Try adjusting your search terms
        </p>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="!loading && !error && strategies.length > 0"
      class="flex items-center justify-center gap-3 mt-8 pt-6 border-t"
    >
      <button
        :disabled="pagination?.page === 1"
        @click="publicStrategy.fetchPublicStrategies(pagination?.page - 1)"
        class="px-4 py-2 bg-white border border-gray-300 rounded-lg
               hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
               transition-all duration-200 font-medium text-gray-700
               flex items-center gap-1"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Previous
      </button>

      <span class="text-gray-700 font-medium px-3">
        Page {{ pagination?.page }} of {{ pagination?.total_pages }}
      </span>

      <button
        :disabled="pagination?.page === pagination?.total_pages"
        @click="publicStrategy.fetchPublicStrategies(pagination?.page + 1)"
        class="px-4 py-2 bg-white border border-gray-300 rounded-lg
               hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
               transition-all duration-200 font-medium text-gray-700
               flex items-center gap-1"
      >
        Next
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
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
import { useChatStore } from '../../stores/chat'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const ownerStore = useAuthStore()
const myUserId = computed(() => {
  return ownerStore.profile?.id || ownerStore.user?.id
})
/* ---------------- Stores ---------------- */
const publicStrategy = publicStrategyStore()
const { strategies, loading, error, pagination } = storeToRefs(publicStrategy)

const chatStore = useTestChatStore()
const socketStore = useChatStore()

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
    // socketStore.startWebSocket()
    const chat = await publicStrategy.startChat(
      strategy.id,
      strategy.owner_id
    )

    await chatStore.fetchChats()

    router.push({
      name: 'Chat',
      params: { chatId: chat.id },
    })
    // await chatStore.fetchMessages(chat.id, chatStore.)
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