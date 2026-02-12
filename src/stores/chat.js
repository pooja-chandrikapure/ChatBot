import { defineStore } from "pinia";
import socket from "../services/socket";
import { SOCKET_EVENTS } from "../constants/socketEvents";
import { useTestChatStore } from "./chatList";
import { useAuthStore } from "./auth";
export const useChatStore = defineStore("chat", {
  state: () => ({
    messages: [],
    lastMessage : null,
    activeChatId: null,
    profileId:null
    // token: null,
  }),
    actions: {
    // Action to send a message
    // initChat(data) {
    //   const {chat_id , role} = data
    //   if(!chat_id) {
    //     console.warn("initChat called without chat_id");
    //     return;
    //   }
    //   const chatListStore = useTestChatStore();
    //   const authStore = useAuthStore();
    //   this.activeChatId = chat_id;

    //   socket.connect({ chat_id, role });
    //   // 🔥 REMOVE old listener to avoid duplicates
    //   // socket.off(SOCKET_EVENTS.MESSAGE);
    //   socket.off('new_message');
    //   socket.off("message_read");
    //   // socket.off('joined_chat');
    //   // socket.off('left_chat');
      
    //   socket.on('test', (data) => { 
    //     console.log('received test' , data)
    //   })

        // socket.on('new_message', (data) => { 
        //   console.log('Store received' , data)
        //     const authUserId = authStore.profile?.id || authStore.user?.id;
        //     console.log(chatListStore.activeChatId);
        //     if (data.chat_id == chatListStore.activeChatId) {
        //       // this.messages.push(data);
        //       // this.lastMessage = data
        //       chatListStore.messages.push(data);
        //       console.log("chatlist", chatListStore.chats)
        //       //emit read event
        //       if (authUserId && authUserId !== data.sender_id) {
        //       socket.emit("mark_messages_as_read", {
        //         chat_id: data.chat_id,
        //         sender_id: data.sender_id,
        //         receiver_id: data.receiver_id
        //       });
        //       console.log("emit funtion",data, data.chat_id, data.sender_id, data.receiver_id)
        //       console.log("authUserId", authUserId)
        //     }
        //     } else {
        //     // Chat is not active → increment unread
        //     let chat = chatListStore.chats.find(c => c.chat_id === data.chat_id);
        //     if (!chat) {
        //       chatListStore.chats.push({
        //         chat_id: data.chat_id,
        //         last_message: data.content,
        //         unread_count: 1,
        //         creator_name: data.sender_name,
        //         messages: []
        //       });
        //     } else {
        //       chat.unread_count = (chat.unread_count || 0) + 1;
        //     }
        //     chatListStore.chats = [...chatListStore.chats]; // ensure reactivity
        //   }
        // });

    //     //read receipt
    //     socket.on("messages_read", (data) => {
    //       console.log("message_read", data);
    //       // const chatListStore = useTestChatStore();
    //       if (data.chat_id !== chatListStore.activeChatId) return;
    //       chatListStore.messages = chatListStore.messages.map((msg) => 
    //         data.message_ids.includes(msg.message_id)
    //           ? { ...msg, is_read: true }
    //         : msg
    //       );
    //     });

    //     socket.on("joined_chat", (res) => {
    //       console.log("Joined chat:", res);
    //     });

    //     socket.on("left_chat", (res) => {
    //       console.log("Left chat:", res)
    //     });
    // },

    startWebSocket() {
      const chatListStore = useTestChatStore()
      socket.connect();
      socket.on('connect' , () => {
        console.log('connected to socket')
      })

      socket.on('new_message', (data) => { 
          if (data.chat_id == chatListStore.activeChatId) {
            chatListStore.messages.push(data);
            if (this.profileId && this.profileId!== data.sender_id) {
              socket.emit("mark_messages_as_read", {
                chat_id: data.chat_id,
                sender_id: data.sender_id,
                receiver_id: data.receiver_id
              });
            }
          } 
          else {
          // Chat is not active → increment unread
          // Inactive chat → update unread + last message
          let chat = chatListStore.chats.find(c => c.id == data.chat_id);

          if (chat) {
            chat.unread_count = (chat.unread_count || 0) + 1;
            chat.last_message = data.content;
            chat.last_message_at = data.created_at;
            chat.sender_name = data.sender_name;
          } else {
            // fallback: if chat does not exist in list
            chatListStore.chats.unshift({
              id: data.chat_id,
              last_message: data.content,
              unread_count: 1,
              last_message_at: data.created_at,
              sender_name: data.sender_name
            });
          }

          // force reactivity
          chatListStore.chats = [...chatListStore.chats];
        }
      });
      socket.on("messages_read", (data) => {
        console.log("messages_read", data);
        // const chatListStore = useTestChatStore();
        if (data.chat_id !== chatListStore.activeChatId) return;
        chatListStore.messages = chatListStore.messages.map((msg) => 
          data.message_ids.includes(msg.message_id)
            ? { ...msg, is_read: true }
          : msg
        );
      })
      socket.on("question_asked", (data) => {
        console.log("question_asked", data);
        // const chatListStore = useTestChatStore();
        chatListStore.fetchChats();

      })
      // socket.emit("mark_messages_as_read",{
      //   chat_id: data.chat_id,
      //   sender_id: data.sender_id,
      //   receiver_id: data.receiver_id
      // })
      // console.log("emit funtion",data, data.chat_id, data.sender_id, data.receiver_id)
    },
    
    sendMessage(content) {
      if (!this.activeChatId) return;
      socket.emit(SOCKET_EVENTS.MESSAGE, {
        chat_id: this.activeChatId,
        content   
         });
    },

    
    ///new Action  
    // markMessagesAsRead({ chat_id, sender_id, receiver_id }) {
    //   console.log("markMessagesAsRead", { chat_id, sender_id, receiver_id })
    //   if(!chat_id || !sender_id || !receiver_id) return;
    //   socket.emit("mark_messages_as_read",
    //     { chat_id: data, 
    //       sender_id, 
    //       receiver_id 
    //     }); 
    // },


    leaveChat() {
      // if(this.activeChatId) {
      //   socket.leaveChat(this.activeChatId);
      // }
      this.activeChatId = null;
        this.messages =[];

        socket.off('new_message');
    },

    disconnectSocket() {
      socket.disconnect();
      this.activeChatId = null;
      this.messages = [];
    }
    // sendMessage(message) {
    //     socket.emit(SOCKET_EVENTS.MESSAGE, message);

    // },
    // clearMessages() {
    //   this.messages = [];
    // },
 },
});