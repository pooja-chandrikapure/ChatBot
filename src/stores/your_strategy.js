import { defineStore } from 'pinia';
import { getYourStrategyApi, createStrategyApi, 
         updateStrategyApi, togglePublishStrategyApi, toggleStrategyStatusApi,
         deleteStrategyApi} from '../services/your_strategy_service';
// import { createStrategyApi } from '../services/your_strategy_service';
export const getYourStrategy= defineStore('your_strategy', {
    state: () => ({
        strategies: [],
        loading: false,
        error: null,
    }),
    actions: {
        async fetchStrategies() {
            this.loading = true; 
            this.error = null;
            try {
                const response = await getYourStrategyApi();
                this.strategies = response.data.data;
                // this.strategies = response;
                return this.strategies;         
            } catch (error) {
                this.error = error.message || 'Failed to fetch strategies';
                console.error('Fetch Strategies Error:', error);
            } finally {
                this.loading = false;
            }
        },
        async createStrategy(formData) {
            this.loading = true;
            this.error = null;
            try {
                const payload = {
                    name: formData.name,
                    description: formData.description,
                    status: Number(formData.status),
                    capital_required: Number(formData.capital_required || 0),
                    published: Number(formData.published)
                }
                const res = await createStrategyApi(payload);
            //push newly created strategy into grid
            this.strategies.unshift(res.data.data);
            return res.data;
            } catch (error) {
                this.error = error.message || 'Failed to create strategy';
                console.error('Create Strategy Error:', error);
            } finally {
                this.loading = false;
            }
        },

        async updateStrategy(id, formData){
            this.loading = true;
            this.error = null;

            try {
                const payload = {
                    name: formData.name,
                    description: formData.description,
                    capital_required: Number(formData.capital_required || 0 ),
                    status: Number(formData.status),
                    published: Number(formData.published)
                };
                const res = await updateStrategyApi(id, payload);

                //update strategy in local state

                const index = this.strategies.findIndex(s => s.id === id);
                if (index !== -1) {
                    this.strategies[index] = res.data.data;
                }
                return res.data.data;
            } catch (error) {
                this.error = error.message || 'Failed to update strategy';
                console.error;
            } finally {
                this.loading = false;
            }

        },

        async togglePublishStrategy(id, published) {
            this.loading = true;
            this.error = null;

            try {
                const res = await togglePublishStrategyApi(id, published);

                const index = this.strategies.findIndex(s => s.id === id);
                if (index !== -1) {
                    this.strategies[index].published = res.data.data.published;
                    this.strategies[index].status = res.data.data.state;
                }
                return res.data.data;
            } catch (error) {
                this.error = error.message || 'Failed To Publish Strategy';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async toggleSatuts(strategyId, status) {
            try {
                const res = await toggleStrategyStatusApi(strategyId, status);
                //update local statte
                const index = this.strategies.findIndex(s => s.id === strategyId);
                if (index !== -1) {
                    this.strategies[index].status = res.data.data.state;
                }
                return res.data.data;
            } catch (err) {
                throw err;
            }
        },
        async togglePublish(strategyId, published) {
            try {
                const res = await togglePublishStrategyApi(strategyId, published);
                //update local statte
                const index = this.strategies.findIndex(s => s.id === strategyId);
                if (index !== -1) {
                    this.strategies[index].published = res.data.data.published;
                    this.strategies[index].status = res.data.data.state;
                    this.strategies[index].published_at = res.data.data.published_at;
                }
                // return res.data;
                return res.data.data;
            } catch (err) {
                throw err;
            }
            },
        

        async deleteStrategyStoreApi(id) {
            this.loading = true
            this.error = null

            try {
                const res = await deleteStrategyApi(id)
                return res.data
            } catch (err) {
                this.error = this.error.message || 'Failed to Delete Startegy'
                throw this.error;
            } finally {
                this.loading = false;
            }
        },
    },   
})
