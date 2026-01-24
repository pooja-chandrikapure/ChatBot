<template>
  <transition name="fade">
  <div
    v-if="isOpen"
    @click.self="close"
    class="fixed inset-0 bg-opacity-60 z-[60] 
    overflow-y-auto flex items-center justify-center
    backdrop-blur-[2px] "
  >
    <div class="bg-white p-6 rounded-lg w-[320px] border-1 border-black">
      <h3 class="text-lg font-semibold mb-3">Enter your OTP</h3>

      <input
        v-model="localOtp"
        type="text"
        class="border w-full px-3 py-2 rounded mb-4 mt-2"
        placeholder="Enter OTP"
      />

      <div class="flex justify-center">
        <button
          class="px-4 py-2 text-white rounded mt-2
          bg-gradient-to-r from-blue-500 to-gray-600 hover:shadow-lg"
          @click="$emit('verify', localOtp)"
        >
          Verify
        </button>
  
      </div>
      <div class="flex justify-center">
        <p class="text-sm text-center text-gray-600 mt-2">
        <button class="text-blue-600 font-semibold ml-1 hover:text-purple-600 transition-colors" >
          Resend
        </button>
      </p>
      </div>
    </div>
  </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  overflow: {
      type: Boolean,
      default: false
    }, 
    // bgModal: {
    //   type: String,
    //   default: 'bg-[#ffffff]'
    // }
})

const localOtp = ref('')
const emit = defineEmits(["close"]);
const close = () => {
    emit("close");
  };

// clear otp when modal opens
watch(
  () => props.isOpen,
  (val) => {
    if (val) localOtp.value = ''
  }
)
</script>
