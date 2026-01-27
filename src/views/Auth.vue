<template>
  
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-8">
    
    <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transform transition-all hover:shadow-3xl">

      <!-- Logo/Icon Area -->
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex mb-8 bg-gray-100 rounded-xl p-1.5">
        <button
          @click="mode = 'login'"
          :class="mode === 'login' ? activeTab : inactiveTab"
          class="transition-all duration-300"
        >
          Login
        </button>
        <button
          @click="mode = 'signup'"
          :class="mode === 'signup' ? activeTab : inactiveTab"
          class="transition-all duration-300"
        >
          Sign Up
        </button>
      </div>

      <!-- Title -->
      <h2 class="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-gray-600 bg-clip-text text-transparent">
        {{ mode === 'login' ? 'Welcome Back' : 'Create Account' }}
      </h2>
      <p class="text-center text-gray-500 text-sm mb-6">
        {{ mode === 'login' ? 'Login to continue your journey' : 'Join us today and get started' }}
      </p>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-5">

        <!-- FULL NAME (Signup only) -->
        <div v-if="mode === 'signup'" class="animate-fadeIn">
          <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <div class="relative">
            <input
              type="text"
              v-model="form.name"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="John Doe"
              required
            />
          </div>
        </div>

        <!-- MOBILE NUMBER (Signup only) -->
        <div v-if="mode === 'signup'" class="animate-fadeIn">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number
          </label>
          <div class="relative">
            <input
              type="tel"
              v-model="form.phone"
              maxlength="10"
              inputmode="numeric"
              @input="form.phone = form.phone.replace(/\D/g, '').slice(0, 10)"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="+91 98765 43210"
              required
            />
          </div>
        </div>

        <!-- ADDRESS (Signup only) -->
        <div v-if="mode === 'signup'" class="animate-fadeIn">
          <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <textarea
            v-model="form.address"
            class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none transition-colors"
            rows="2"
            placeholder="123 Street Name, City"
            required
          ></textarea>
        </div>

        <!-- EMAIL -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <div class="flex gap-3">
            <div class="relative flex-1">
              <input
                type="email"
                v-model="form.email"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <button
              v-if="mode === 'signup'"
              type="button"
              @click="openOtpPopup"
              :disabled="authStore.otpVerified"
              class="px-6 py-3 rounded-lg text-white text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md"
              :class="authStore.otpVerified ? 'bg-green-500 hover:bg-green-600' : 'bg-gradient-to-r from-blue-500 to-gray-600 hover:shadow-lg'"
            >
              {{ authStore.otpVerified ? '✓ Verified' : 'Send OTP' }}
            </button>
          </div>
        </div>

        <!-- PASSWORD -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
           <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="form.password"
              class="w-full px-3 md:px-4 py-2.5 md:py-3 pr-10 md:pr-12 text-sm md:text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <!-- Eye Icon (Show) -->
              <svg v-if="showPassword" class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <!-- Eye Slash Icon (Hide) -->
              <svg v-else class="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- BUTTON -->
        <button
          type="submit"
          class="w-full bg-gradient-to-r from-blue-500 to-gray-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mt-6"
        >
          {{ mode === 'login' ? 'Login Now' : 'Create Account' }}
        </button>
      </form>

      <!-- Footer -->
      <p class="text-sm text-center text-gray-600 mt-8">
        {{ mode === 'login' ? "Don't have an account?" : "Already have an account?" }}
        <button class="text-blue-600 font-semibold ml-1 hover:text-purple-600 transition-colors" @click="toggleMode">
          {{ mode === 'login' ? 'Sign Up' : 'Login' }}

        </button>
      </p>

    </div>
    
    <OtpPopup
      :isOpen="showOtpModal"
      :overflow="false"
      @close="closePlaceOrderModal()"
      @verify="handleVerifyOtp"
      @resend="handleResendOtp"
    />
  </div>
  
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import router from '../router'
import OtpPopup from '../components/Popup/otp-popup.vue'
import { useToastStore } from '../stores/toast'


const authStore = useAuthStore()
const mode = ref('login')
const showOtpModal = ref(false)
const showPassword = ref(false)
const toast = useToastStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  address: '',
  phone: '',
})

const activeTab = 'flex-1 py-2.5 rounded-lg bg-white shadow-md text-sm font-semibold text-gray-800'
const inactiveTab = 'flex-1 py-2.5 rounded-lg text-sm text-gray-500 hover:text-gray-700'

const toggleMode = () => {
  mode.value = mode.value === 'login' ? 'signup' : 'login'
}

const closePlaceOrderModal = () => {
  showOtpModal.value = false
  // placeOrderData.value = formData
}

const openOtpPopup = async () => {
  if (!form.email) {
    toast.error('Please enter your email')
    return
  } 
   
  try {
    await authStore.sendOtp(form.email)
    toast.success(res.data.message)
    console.log('OTP sent to:', form.email)
    console.log('jbhg', authStore.sendOtp)
    alert('OTP sent to your email')
  } catch (error) {
    toast.error(error.response.data?.message )
    // toast.error(error.message ||'Failed to send OTP. Please try again' )
    // alert(error.message || 'Failed to send OTP')
    return
  }
  showOtpModal.value = true
}

const handleVerifyOtp = async (otp) => {
  try {
    await authStore.verifyOtp({ email: form.email, otp })
    toast.success('OTP verified successfully')
    console.log('OTP verified for:', form.email)
    console.log('jbhg', authStore.verifyOtp)
    // alert('OTP verified successfully')
    showOtpModal.value = false
  } catch {
    // alert('Invalid OTP')
    toast.error(error.message || 'Invalid OTP.')
  }
}

const handleResendOtp = async () => {
  await authStore.sendOtp(form.email)
  toast.success('OTP resent to your email successfully')
  // alert('OTP resent')
}

const handleSubmit = async () => {
  try {
    if (!form.email || !form.password) {
      // alert('Email and password are required')
      toast.error('Email and password are required')
      return
    }

    if (mode.value === 'signup') {
      if (!form.name || !form.address || !form.phone) {
        // alert('All fields are required')
        toast.error('All fields are required')
        return
      }
      if (form.phone.length !== 10) {
        toast.error('Please enter a valid phone number')
        return
      }

      if (!authStore.otpVerified) {
        // alert('Please verify OTP before creating account')
        toast.error('Please verify OTP before creating account')
        return
      }

      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
      }

      await authStore.signup(payload)
      if(authStore.error) {
        toast.error(authStore.error || 'signup failed')
        return
      }
      toast.success('Account created successfully! Please login.')
      mode.value = 'login'
      console.log('User signed up with email:', form.email)
      console.log('jbhg', authStore.signup)
    } else {
      await authStore.login({
        email: form.email.trim(),
        password: form.password.trim(),
      })
      if(authStore.error) {
        toast.error(authStore.error || 'login failed')
        return
      }
      if(authStore.error)
      {
        toast.error("Network Error")
        return
      }
      if (toast.success) {
        toast.success('Logged in successfully!')
      } else {
        toast.error('Invalid login credentials')
      }

      router.push('/')
      console.log('User logged in with email:', form.email)
      console.log('hello pooja', authStore.login)
    }
  } catch (error) {
    alert(error.message || 'Something went wrong')
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>