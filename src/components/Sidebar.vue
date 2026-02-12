<template>
  <!-- Mobile top bar (hamburger) -->
  <div class="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 text-white flex items-center px-4 py-3 shadow-lg">
    <button @click="isOpen = true" class="text-2xl hover:text-emerald-400 transition-colors">
      ☰
    </button>
    <span class="ml-4 font-semibold">My Dashboard</span>
  </div>

  <!-- Overlay (mobile only) -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden backdrop-blur-sm"
    @click="isOpen = false"
  ></div>

  <!-- Hover trigger area (desktop only) - invisible hoverable zone -->
  <div 
    class="hidden md:block fixed left-0 top-0 bottom-0 w-3 z-30"
    @mouseenter="handleHoverEnter"
  ></div>

  <!-- Sidebar -->
  <aside
    class="fixed top-0 left-0 z-50 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col
           transform transition-transform duration-300 ease-in-out shadow-2xl"
    :class="[
      // Mobile: use isOpen
      isOpen ? 'translate-x-0' : '-translate-x-full',
      // Desktop: use isHovered
      'md:-translate-x-56',
      isHovered ? 'md:translate-x-0' : ''
    ]"
    @mouseenter="handleSidebarEnter"
    @mouseleave="handleSidebarLeave"
  >
    <!-- Logo / Header -->
    <div class="px-6 py-5 text-xl font-bold border-b border-gray-700/50 flex justify-between items-center bg-gray-800/50">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
          <span class="text-sm font-bold">D</span>
        </div>
        <span class="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">My Dashboard</span>
      </div>
      <button class="md:hidden text-xl hover:text-emerald-400 transition-colors" @click="isOpen = false">✕</button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-2 text-base font-medium overflow-y-auto">
      <router-link to="/home" class="nav-item group" @click="closeMobile">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        <span>Dashboard</span>
      </router-link>

      <router-link to="/Your_strategy" class="nav-item group" @click="closeMobile">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <span>Your Strategy</span>
      </router-link>

      <router-link to="/Public_strategy" class="nav-item group" @click="closeMobile">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>Public Strategy</span>
      </router-link>

      <router-link to="/chat" class="nav-item group" @click="closeMobile">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
        <span>Chat</span>
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="px-4 py-4 border-t border-gray-700/50 flex items-center gap-3 bg-gray-800/30">
      <div class="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center font-bold shadow-lg">
        {{ profile?.name?.slice(0, 1) || 'U' }}
      </div>

      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold truncate">{{ profile?.name || 'User' }}</p>
        <button @click="logout" class="text-xs text-red-400 hover:text-red-300 transition-colors font-medium">
          Logout
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

const profileStore = useAuthStore();
const { profile, loading, error, message } = storeToRefs(profileStore);

const isOpen = ref(false);
const isHovered = ref(false);
let hoverTimeout = null;

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  profileStore.fetchProfile();
})

const handleHoverEnter = () => {
  clearTimeout(hoverTimeout);
  isHovered.value = true;
};

const handleSidebarEnter = () => {
  clearTimeout(hoverTimeout);
  isHovered.value = true;
};

const handleSidebarLeave = () => {
  // Add small delay before hiding to prevent flickering
  hoverTimeout = setTimeout(() => {
    isHovered.value = false;
  }, 200);
};

const closeMobile = () => {
  if (window.innerWidth < 768) {
    isOpen.value = false;
  }
};

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  color: #d1d5db;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #10b981, #059669);
  transform: scaleY(0);
  transition: transform 0.2s ease;
}

.nav-item:hover {
  background: linear-gradient(to right, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05));
  color: #10b981;
  transform: translateX(4px);
}

.nav-item:hover::before {
  transform: scaleY(1);
}

.router-link-active {
  background: linear-gradient(to right, rgba(17, 24, 39, 0.8), rgba(31, 41, 55, 0.4));
  color: #10b981;
}

.router-link-active::before {
  transform: scaleY(1);
}

.nav-item svg {
  transition: transform 0.2s ease;
}

.nav-item:hover svg {
  transform: scale(1.1);
}

/* Smooth scrollbar */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

nav::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.3);
  border-radius: 10px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.5);
}
</style>