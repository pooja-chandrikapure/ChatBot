// import { defineStore } from "pinia";
// import { getPublicStrategiesApi } from "../services/public_StrategyService";

import { defineStore } from "pinia";
import { ref } from "vue";
import { getPublicStrategiesApi , startChatApi} from "../services/public_StrategyService";

export const publicStrategyStore = defineStore('public_strategy', {
    state: () => ({
        strategies: [],
        pagination: {
            page: 1,
            total_pages: 0,
            total_items: 0,

        },
        currentChat: null,
        loading: false,
        error: null,
        selectedChatId : null
        
        
    }),

    actions: {
        async fetchPublicStrategies(page = 1, perPage = 10) {
            this.loading = true
            this.error = null

            try {
                const res = await getPublicStrategiesApi({
                    page,
                    per_page: perPage,
                })
              
                this.strategies = res.data.data
                this.pagination = res.data.pagination
            } catch (err) {
                this.error = err.message || 'something went wrong'
            } finally {
                this.loading = false
            }
        },

        async startChat(strategyId, creatorId) {
            this.loading =true
            this.error = null
            console.log("strategy id",strategyId)
            console.log("cfeator id", creatorId)
            try {
                const payload = {
                    strategy_id: strategyId,
                    creator_id: creatorId,
                }
                const res = await startChatApi(payload)

                this.currentChat = res.data.data
                this.selectedChatId = res.data.data.chat_id
                console.log("currentCat", this.currentChat)
                return this.currentChat
            } catch (err) {
                this.error = err.message || 'Unable to start Chat'
                throw err
            } finally {
                this.loading = false
            }
        },
        clearChat() {
            this.currentChat = null
        },
    },
})


// export const usePublicStrategyStore = defineStore('publicstrategies', () => {
//   const strategies = ref([])
//   const pagination = ref({
//     page: 1,
//     total_pages: 0,
//     total_items: 0,
//   })
//   const loading = ref(false)
//   const error = ref(null)

//   const fetchPublicStrategies = async (page = 1, perPage = 10) => {
//     loading.value = true
//     error.value = null

//     try {
//       const res = await getPublicStrategiesApi({
//         page,
//         per_page: perPage,
//       })

//       strategies.value = res.data.data || []
//       pagination.value = res.data.pagination || pagination.value

//     } catch (err) {
//       error.value = err.message || 'Something went wrong'
//     } finally {
//       loading.value = false
//     }
//   }

//   fetchPublicStrategies()

//   return {
//     strategies,
//     pagination,
//     loading,
//     error,
//     fetchPublicStrategies,
//   }
// })