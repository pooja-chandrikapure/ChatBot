import api from "./api";

export const getChatListApi = async () => {
    try{
        const res = await api.get('/chat/list')
        return res
    } catch (error) {
        console.error('Get Chat List Api Error:', error)
        throw error
    }
}

/* GET messages of a chat */
export const getChatMessagesApi = async (chatId) => {
  try {
    return await api.get(`/chat/${chatId}/messages`);
  } catch (error) {
    console.error("Get Messages Api Error:", error);
    throw error;
  }
};
/* POST send message */
export const sendChatMessageApi = async (chat_id, payload) => {
  try {
    console.log("chat_payload", payload)
    const response = await api.post(`/chat/${chat_id}/message`, payload);

    return response
  } catch (error) {
    console.error("Chat Post Api Error", error);
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || "Failed to send message",
    };
  }
};

// MARK MESSAGES AS READ
export const markAsReadApi = async (chat_id) => {
  try {
    const response = await api.put(`/chat/${chat_id}/read`);
    return response.data.data;
  } catch (error) {
    console.error('Mark as Read API Error:', error);
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || 'Failed to mark messages as read',
    };
  }
};
// GET UNREAD COUNT
export const getUnreadCountApi = async () => {
  try {
    const response = await api.get(`/chat/all-unread-counts`);
    return response.data.data;/////changes
  } catch (error) {
    console.error('Unread Count API Error:', error);
    throw {
      status: error.response?.status,
      message: error.response?.data?.message || 'Failed to fetch unread count',
    };
  }
};
// Fetch chat list
export const fetchChatListApi = async () => {
  return api.get('/chat');
}