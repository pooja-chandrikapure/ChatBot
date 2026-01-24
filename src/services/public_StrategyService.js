import api from "./api";


export const getPublicStrategiesApi = async (params = {}) => {
  try {
    const response = await api.get('/strategy/public', {
      params: {
        page: params.page || 1,
        per_page: params.per_page || 10,
      },
      skipAuth: true, // 🔥 public API
    })

    return response
  } catch (error) {
    console.error('Get Public Strategies API Error:', error)
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || 'Failed to fetch public strategies',
    }
  }
}
export const startChatApi = async (payload) => {
    try{
      console.log("playload", payload)
        const response = await api.post('/chat/start', payload)
        
        return response
        
    } catch (error) {
        console.error("start chat Api Error", error)
        throw {
            status: error.response?.status,
            message: error.response?.data?.message || 'failed to start chat'
        }
    }
}