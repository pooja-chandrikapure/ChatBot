<template>
  <div class="flex  bg-gray-100">
    <Sidebar />

    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from '../../components/Sidebar.vue';
</script>