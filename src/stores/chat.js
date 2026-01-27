import { defineStore } from "pinia";
import socket from "../services/socket";
import { SOCKET_EVENTS } from "../constants/socketEvents";
import { useTestChatStore } from "./chatList";
export const useChatStore = defineStore("chat", {
  state: () => ({
    messages: [],
    lastMessage : null,
    activeChatId: null,
    // token: null,
  }),
    actions: {
    // Action to send a message
    initChat({ chat_id, role}) {
      if(!chat_id) {
        console.warn("initChat called without chat_id");
        return;
      }
      this.activeChatId = chat_id;

      socket.connect({ chat_id, role });
      // 🔥 REMOVE old listener to avoid duplicates
      socket.off(SOCKET_EVENTS.MESSAGE);
      
        socket.on('new_message', (data) => { 
            console.log("Received message:", data);
            console.log(this.activeChatId);
            console.log(this.messages);
            const chatListStore = useTestChatStore();
            // this.token = localStorage.getItem("token");
            if (data.chat_id === this.activeChatId) {
              // this.messages.push(data);
              this.lastMessage = data
            } else {
              const chat = chatListStore.chats.find(c => c.chat.id === data.chat_id);
            }

            if (chat) {
                chat.unread_count = (chat.unread_count || 0) + 1;
            }
            
        });
        socket.on("joined_chat", (res) => {
          console.log("Joined chat:", res);
        });

        socket.on("left_chat", (res) => {
          console.log("Left chat:", res)
        });
    },

    sendMessage(content) {
      if (!this.activeChatId) return;
      socket.emit(SOCKET_EVENTS.MESSAGE, {
        chat_id: this.activeChatId,
        content   
         });
    },

    leaveChat() {
      if(this.activeChatId) {
        socket.leaveChat(this.activeChatId);
      }
      this.activeChatId = null;
        this.messages =[];
    },

    // disconnectSocket() {
    //   socket.disconnect();
    //   this.activeChatId = null;
    //   this.messages = [];
    // }
    // sendMessage(message) {
    //     socket.emit(SOCKET_EVENTS.MESSAGE, message);

    // },
    // clearMessages() {
    //   this.messages = [];
    // },
 },
});