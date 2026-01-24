import api from './api'

/* === Send OTP === */
export const sendOtpApi = (email) => {
  return api.post('/auth/send_otp', { email })
}

export const verifyOtpApi = (payload) => {
  return api.post('/auth/verify_otp', payload)
}

/* === SIGNUP === */
// export const signupApi = async (payload) => {
//   return api.post('/auth/create_account', payload)
// }
export const signupApi = async (payload) => {
  try {
    const response = await api.post(
      '/auth/create_account',
      payload,
      {
        skipAuth: true, // 🔥 VERY IMPORTANT
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    console.log('resonse',response)
    return response
  } catch (error) {
    console.error('Signup API Error:', error)

    // Re-throw so store/component can handle it
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || 'Signup failed',
    }
  }
}
// '/auth/create_account'
/* === LOGIN (if exists) === */
export const loginApi = async (payload) => {
  // return api.post('/auth/login', payload)
  try {
    const response = await api.post(
      '/auth/login',
      payload,
      {
        skipAuth: true, // 🔥 VERY IMPORTANT
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    console.log('login response api service',response)
    return response
  } catch (error) {
    console.error('Login API Error:', error)
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || 'Login failed',
    }
  }

}


