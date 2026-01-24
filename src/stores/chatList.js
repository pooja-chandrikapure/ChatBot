import { defineStore } from "pinia";
import { getChatListApi, getChatMessagesApi, sendChatMessageApi,
    markAsReadApi, getUnreadCountApi, fetchChatListApi
 } from "../services/chatList_Services";
import { io } from "socket.io-client";

export const useTestChatStore = defineStore('testchats', {
    state: () => ({
        chats: [],
        messages: [],
        messageChat: null,
        loading: false,
        error: null,
        socket: null,
        activeChatId: null,
    }),

    actions: {
        async fetchChats() {
            this.loading = true
            this.error = null

            try {
                const res = await getChatListApi()

                this.chats = res.data.data;
            } catch (err) {
                this.error = err.response?.data?.message || 'Failad to Load the Chat'
            } finally {
                this.loading = false
            }
        },

        /* */
        async fetchMessages(chatId, userId) {
            this.loading = true;
            this.activeChatId = chatId;

            try {
                const res = await getChatMessagesApi(chatId);
                this.messages = res.data.data;
                // this.initSockect(userId);
            } catch (err) {
                this.error = err.message;
            } finally {
                this.loading = false;
            }
        },

        /*INit scoket */

        initSockect(userId) {
            if (this.socket) return;

            this.socket = io(import.meta.env.VITE_SOCKET_URL, {
                auth:{
                    token: localStorage.getItem("token"),
                },
                query:{
                    token: localStorage.getItem("token"),
                },
            });

            

            // this.socket.emit("join", { room: `user_${userId}`});
            this.socket.on("new_message", (message) => {
                console.log('messageeeeeeeeeeee' , message)
                if (message.chat_id === this.activeChatId) {
                    this.messages.push(message);
                }
            });
        },

        /* */
        async sendMessage(chat_id, content, receiver_id ) {
            if(!content.trim()) return;

            try {
                const payload = {
                    content: content,
                    // chat_id,
                    // receiver_id,
                }
                const res = await sendChatMessageApi(chat_id , payload)
                console.log("payload", payload)
                this.messages.push(res.data.data)
                // this.messageChat = res.data.data
                return this.messageChat
                // await sendChatMessageApi(chatId, { 
                //     content,
                //     receiver_id: receiverId 
                // });

            } catch (err) {
                this.error = err.message;
            }
        },

        /*clear */
        clearMessages() {
            this.messages = [];
            if (this.socket) {
                this.socket.disconnect();
                this.socket = null;
            }
        },
        async fetchChatApi(){
            this.loading = true;
            try{
                const res = await fetchChatListApi();
                this.chats = res.data.data;
            }catch(err){
                this.error = err.response?.data?.message || 'Failad to Load the Chat'
            }finally{
                this.loading = false
            }
        },

        //unread count
        async getUnreadCountApiStore(chat_id) {
            try {
                const count = await getUnreadCountApi(chat_id);
                const chat = this.chats.find(c => c.chat_id === chat_id);
                if (chat) {
                    chat.unread_count = count;
                }
                // return response.data.data.unread_count;
            } catch (error) {
                console.error('Unread Count API Error:', error);
                throw {
                    status: error.response?.status,
                    message: error.response?.data?.message || 'Failed to fetch unread count',
                };
            }
        },
        async markAsReadApiStore(chat_id) {
            try {
                await markAsReadApi(chat_id);
                const chat = this.chats.find(chat => chat.chat_id === chat_id);
                if (chat) {
                    chat.unread_count = 0;
                }
                //optional markd as read///////
                this.messages.forEach(message => {
                    if (message.chat_id === chat_id) {
                        message.is_read = true;
                    }
                    
                })
            } catch (error) {
                console.error('Mark as Read API Error:', error);
                throw {
                    status: error.response?.status,
                    message: error.response?.data?.message || 'Failed to mark messages as read',
                };
            }
        },
        async openChat(chat) {
            this.activeChatId = chat.chat_id;
            await this.markAsReadApiStore(chat.chat_id);
        },
        

    },
        // async createSendApiStore(chat)
    // },
});