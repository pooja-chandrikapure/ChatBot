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

                this.chats = res.data.data.map(chat => ({
                    ...chat,
                    unread_count: 0 ///chnages
                }));
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
                // this.messages.push(res.data.data)
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
        async fetchUnreadCounts() {
            try {
                const unreadList = await getUnreadCountApi(); ///changes
                console.log("fetching unread counts", unreadList);

                unreadList.forEach(item => {
                    // console.log("id",item.chat_id)
                    const chat = this.chats.find(c => c.id === item.chat_id);
                    // console.log("chat id",chat)

                    if (chat) {
                        chat.unread_count = item.unread_count;
                    }
                    // console.log("chatid",item.unread_count)
                });
            } 
            catch (error) {
                console.error('Unread Count API Error:', error);
            }

        },
        async markAsReadApiStore(chat_id) {
            console.log("marking chat as read", chat_id)
            try {
                await markAsReadApi(chat_id);
                const chat = this.chats.find(chat => chat.id === chat_id);
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
            console.log("open chat", chat)
            this.activeChatId = chat.chat_id;
            await this.markAsReadApiStore(chat.chat_id);
        },
        

    },
        // async createSendApiStore(chat)
    // },
});