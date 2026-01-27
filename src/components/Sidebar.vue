<template>
  <!-- Mobile top bar (hamburger) -->
  <div class="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white flex items-center px-4 py-3">
    <button @click="isOpen = true" class="text-2xl">
      ☰
    </button>
    <span class="ml-4 font-semibold">My Dashboard</span>
  </div>

  <!-- Overlay (mobile only) -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
    @click="isOpen = false"
  ></div>

  <!-- Sidebar -->
  <aside
    class="fixed md:static top-0 left-0 z-50 h-screen w-64 bg-gray-900 text-white flex flex-col
           transform transition-transform duration-300
           md:translate-x-0"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
  >
    <!-- Logo / Header -->
    <div class="px-6 py-4 text-xl font-bold border-b border-gray-700 flex justify-between items-center">
      My Dashboard
      <button class="md:hidden text-xl" @click="isOpen = false">✕</button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-6 space-y-2 text-lg font-semibold overflow-y-auto">
      <router-link to="/home" class="nav-item" @click="closeMobile">
        Dashboard
      </router-link>

      <router-link to="/Your_strategy" class="nav-item" @click="closeMobile">
        Your Strategy
      </router-link>

      <router-link to="/Public_strategy" class="nav-item" @click="closeMobile">
        Public Strategy
      </router-link>

      <router-link to="/chat" class="nav-item" @click="closeMobile">
        Chat
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="px-4 py-4 border-t border-gray-700 flex items-center gap-3">
      <div class="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center font-bold">
        {{ profile?.name.slice(0, 1) }}
      </div>

      <div class="flex-1">
        <p class="text-sm font-semibold">{{ profile?.name }}</p>
        <button @click="logout" class="text-xs text-red-400 hover:text-red-300">
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

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  profileStore.fetchProfile();
})

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
  display: block;
  padding: 10px 14px;
  border-radius: 8px;
  color: #d1d5db;
}

.nav-item:hover {
  background-color: #374151;
  color: white;
}

.router-link-active {
  background-color: #111827;
  color: white;
}
</style>
