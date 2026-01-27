import { defineStore } from 'pinia'
import { signupApi, loginApi, sendOtpApi, verifyOtpApi, getProfileApi } from '../services/auth_services'
import socket from '../services/socket';
// import Toast from '../components/toast.vue';
import { useToastStore } from './toast';

// const toast = useToastStore();

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    profile: null,
    otpSent: false,
    otpVerified: false,
    loading: false,
    error: false,
    userNotFoundMessage: "",
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    // compareAuthentication() {
    //   this.isAuthenticated = false;
    // },

    // storeToken(token) {
    //   localStorage.setItem('token', token);
    // },

    // ==== // SEND OTP
    async sendOtp(email) {
      await sendOtpApi(email)
      this.otpSent = true
      console.log('OTP sent to:', email)
    },

    // === // VERIFY OTP

    async verifyOtp(payload) {
      await verifyOtpApi(payload)
      this.otpVerified = true
    },
    /* ===== SIGNUP ===== */
    // async signup(payload) {
    //   const res = await signupApi(payload)

    //   this.user = res.datauser || null
    //   this.token = res.data.token || null
    //   this.isAuthenticated = true

    //   if (this.token) {
    //     localStorage.setItem('token', this.token)
    //   }
    //   if (this.user) {
    //     localStorage.setItem('user', JSON.stringify(this.user))
    //   }
    // },
    

    async signup(payload) {
      try {
        const res = await signupApi(payload)

        this.user = res.data?.user || null
        this.token = res.data?.token || null
        this.isAuthenticated = true
        this.userNotFoundMessage = "";
        this.error = false;
        

        if (this.token) {
          localStorage.setItem('token', this.token)
        }
        if (this.user) {
          localStorage.setItem('user', JSON.stringify(this.user))
        }

        // return res
      } catch (error) {
        // Handle 400 (Bad Request)
        this.error = true;
        if (error.res && error.res.status === 400) {
          this.userNotFoundMessage = "User not found";
          return{ succes: false, message: "user not found"};
        }

        // Handle other errors
        else {
          this.error = true;
          return { succes: false, message: "ferfer"};
        }
      }
      finally {
        this.loading=false;
      }
    },


    /* ===== LOGIN ===== */
    async login(payload) {
      const res = await loginApi(payload)

      const token =
        res.data?.token ||
        res.data?.access_token ||
        res.data?.data?.token

      const user =
        res.data?.user ||
        res.data?.data?.user ||
        null

      if (!token) {
        throw new Error("Token not found in login response")
      }

      this.token = token
      this.user = user
      this.isAuthenticated = true

      localStorage.setItem('token', token)
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      }
    },
    async fetchProfile() {
      try {
        const res = await getProfileApi();
        if(res.data.status === "success") {
          this.profile = res.data.data;
          this.message = res .data.message;
          
        }
       
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch profile';
        console.error('Error fetching profile:', err);
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      this.otpSent = false;
      this.otpVerified = false;

      // Disconnect socket on logout
      console.log("Logging out, disconnecting socket...",socket.disconnect());
      socket.disconnect();
      console
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})
