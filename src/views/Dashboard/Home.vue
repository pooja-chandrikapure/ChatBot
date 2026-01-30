<template>
  <div class="min-h-screen sm:h-full flex flex-col md:h-[120vh] bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading profile...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center h-screen">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
        <p class="text-red-600 font-semibold">{{ error }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else-if="profile" class="px-2 py-4 md:py-0 md:px-8 md:mt-0 mt-6">
      <!-- Hero Section -->
      <div class="max-w-6xl mx-auto mb-12">
        <!-- Welcome Header -->
        <div class="mb-12 animate-fadeIn">
          <!-- <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Welcome back, <span class="text-blue-600">{{ profile.name }}</span>
          </h1> -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 md:p-8 shadow-lg mt-6 text-white transform hover:scale-[1.02] transition-transform duration-300">
            <h2 class="text-2xl md:text-3xl font-bold mb-3">
              Welcome {{ profile.name }} ! 
            </h2>
            <p class="text-xl md:text-xl font-bold mb-3">
              Your Strategy Hub
            </p>
            <p class="text-lg font-semibold mb-2 text-blue-100">
              Build. Publish. Connect.
            </p>
            <p class="text-base text-blue-50 max-w-3xl">
              This is your space to create powerful trading strategies and share them with the world.
            </p>
          </div>
        </div>

        <!-- Carousel Section -->
        <div class="mb-8">
          <div class="relative bg-white rounded-xl shadow-lg overflow-hidden">
            <!-- Carousel Container -->
            <div class="relative h-80 md:h-80">
              <!-- Slide 1: Create & Publish -->
              <div
                :class="[
                  'absolute inset-0 transition-all duration-500 ease-in-out p-8 md:p-12',
                  currentSlide === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
                ]"
              >
                <div class="flex flex-col md:flex-row items-center gap-8 h-full">
                  <div class="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8 md:w-1/3 flex items-center justify-center">
                    <svg class="w-24 h-24 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path>
                    </svg>
                  </div>
                  <div class="md:w-2/3">
                    <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Create & Publish Strategies</h3>
                    <p class="text-gray-600 text-base md:text-lg leading-relaxed">
                      Design strategies your way — structured, transparent, and performance-driven. Once ready, publish them publicly and let users explore, follow, and trust your work.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Slide 2: Real-Time Chat -->
              <div
                :class="[
                  'absolute inset-0 transition-all duration-500 ease-in-out p-8 md:p-12',
                  currentSlide === 1 ? 'opacity-100 translate-x-0' : currentSlide < 1 ? 'opacity-0 translate-x-full' : 'opacity-0 -translate-x-full'
                ]"
              >
                <div class="flex flex-col md:flex-row items-center gap-8 h-full">
                  <div class="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-8 md:w-1/3 flex items-center justify-center">
                    <svg class="w-24 h-24 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </div>
                  <div class="md:w-2/3">
                    <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Real-Time Chat with Users</h3>
                    <p class="text-gray-600 text-base md:text-lg leading-relaxed">
                      Got questions coming in? Good. Users can directly message you for clarifications, doubts, or insights — all in real time. No middlemen, no delays.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Slide 3: Build Audience -->
              <div
                :class="[
                  'absolute inset-0 transition-all duration-500 ease-in-out p-8 md:p-12',
                  currentSlide === 2 ? 'opacity-100 translate-x-0' : currentSlide < 2 ? 'opacity-0 translate-x-full' : 'opacity-0 -translate-x-full'
                ]"
              >
                <div class="flex flex-col md:flex-row items-center gap-8 h-full">
                  <div class="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 md:w-1/3 flex items-center justify-center">
                    <svg class="w-24 h-24 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div class="md:w-2/3">
                    <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Build Your Audience</h3>
                    <p class="text-gray-600 text-base md:text-lg leading-relaxed">
                      Your strategy isn't just code — it's your brand. Engage with users, explain your logic, and grow a community that believes in your approach.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Slide 4: Dashboard Control -->
              <div
                :class="[
                  'absolute inset-0 transition-all duration-500 ease-in-out p-8 md:p-12',
                  currentSlide === 3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
                ]"
              >
                <div class="flex flex-col md:flex-row items-center gap-8 h-full">
                  <div class="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-8 md:w-1/3 flex items-center justify-center">
                    <svg class="w-24 h-24 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <div class="md:w-2/3">
                    <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">One Dashboard. Full Control.</h3>
                    <p class="text-gray-600 text-base md:text-lg leading-relaxed">
                      Track engagement, manage strategies, and stay connected — all from one clean dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Carousel Controls -->
            <div class="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4">
              <!-- Previous Button -->
              <button
                @click="previousSlide"
                class="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-full shadow-md transition-all duration-200"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>

              <!-- Dots Indicator -->
              <div class="flex gap-2">
                <button
                  v-for="index in 4"
                  :key="index"
                  @click="currentSlide = index - 1"
                  :class="[
                    'w-2.5 h-2.5 rounded-full transition-all duration-300',
                    currentSlide === index - 1 ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                  ]"
                ></button>
              </div>

              <!-- Next Button -->
              <button
                @click="nextSlide"
                class="bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-full shadow-md transition-all duration-200"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="animate-fadeIn">
          <div class="bg-white border-2 border-blue-100 rounded-xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">
              Ready to create something impactful?
            </h3>
            <p class="text-gray-600 text-base md:text-lg mb-6 max-w-2xl mx-auto text-center">
              Start by creating your first strategy and put it out there. The right audience is already waiting.
            </p>
            <div class="text-center">
              <button @click="$router.push('/Your_strategy')"
              class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                Create Your First Strategy →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../../stores/auth';

const profileStore = useAuthStore();
const { profile, loading, error } = storeToRefs(profileStore);

const currentSlide = ref(0);
let autoPlayInterval = null;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % 4;
};

const previousSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? 3 : currentSlide.value - 1;
};

// Auto-play carousel
const startAutoPlay = () => {
  autoPlayInterval = setInterval(() => {
    nextSlide();
  }, 5000); // Change slide every 5 seconds
};

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
  }
};

onMounted(() => {
  profileStore.fetchProfile();
  startAutoPlay();
});

onUnmounted(() => {
  stopAutoPlay();
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out;
}
</style>
      <!-- </div>
    </div>
  </div>
</template> -->

<!-- <script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../../stores/auth';

const profileStore = useAuthStore();
const { profile, loading, error } = storeToRefs(profileStore);

onMounted(() => {
  profileStore.fetchProfile();
});
</script> -->