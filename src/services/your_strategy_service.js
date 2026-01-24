import axios from "axios";
import api from "./api";
import Strategy from "../views/Dashboard/Strategy.vue";

export const getYourStrategyApi = async () => {
  try {
    const payload = {};
    const response = await api.get('/strategy/private', {
        params: payload,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response

  } catch (error) {
    console.error('Get Your Strategy API Error:', error);
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || 'Get Your Strategy failed',
    };
  }
};
/* Post Api*/
export const createStrategyApi = async (payload) => {
  return api.post('/strategy/create', payload);
};

/*Put */
export const updateStrategyApi = (id, payload) => {
  return api.put(`/strategy/${id}`, payload);
};

/*Patch */
// Toggle STATUS (0 / 1)
export const toggleStrategyStatusApi = (strategyId, status) => {
  return api.patch(`/strategy/${strategyId}/toggle-status`, {
    status: status ? 1 : 0
  });
};

// Publish / Unpublish (0 / 1)
export const togglePublishStrategyApi = (strategyId, published) => {
  return api.patch(`/strategy/${strategyId}/publish`, {
    published: published ? 1 : 0
  });
};

export const deleteStrategyApi = (id, payload) => {
  return api.delete(`/strategy/${id}`, payload)
}