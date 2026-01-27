<template>
  <div class="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow">

    <h2 class="text-2xl font-semibold mb-4">Welcome</h2>

    <!-- Loading -->
    <p v-if="loading" class="text-gray-500">
      Loading profile...
    </p>

    <!-- Error -->
    <p v-else-if="error" class="text-red-500">
      {{ error }}
    </p>

    <!-- Profile -->
    <div v-else-if="profile" class="space-y-3 font-semibold">
      
      <p><strong></strong> {{ profile.name }}</p>
     
     

    </div>

  </div>
</template>

<script setup>
import Sidebar from '../../components/Sidebar.vue';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../../stores/auth';

const profileStore = useAuthStore();
const { profile, loading, error, message } = storeToRefs(profileStore);

onMounted(() => {
  profileStore.fetchProfile();
});
</script>