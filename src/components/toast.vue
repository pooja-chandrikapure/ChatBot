<template>
  <transition name="slide-fade">
    <div
      v-if="toast.show"
      class="fixed top-5 right-5 z-50 px-6 py-3 rounded-lg shadow-lg text-white"
      :class="toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'"
    >
      {{ toast.message }}
    </div>
  </transition>
</template>

<script setup>
import { useToastStore } from '../stores/toast'
const toast = useToastStore()
</script>

<style>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
