// import { io } from "socket.io-client";

// const socket = io("https://16qldnx9-7000.inc1.devtunnels.ms/", {
//   transports: ["websocket"]
// });

// export default socket;
import { io } from "socket.io-client";

class SocketService {
  socket = null;

  connect({ chat_id = null, role = null } = {}) {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found in localStorage. Socket connection aborted.");
      return;
    }
    // prevent duplicate connections
    if (this.socket) return;

    this.socket = io("https://16qldnx9-5001.inc1.devtunnels.ms", {
      transports: ["websocket"],
      query: {
        token,
        chat_id,
        role
      },
      reconnection: true,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
        console.log("Socket connected:", this.socket.id);
      });

      this.socket.on('new_message' , (mes) => {
        console.log('received new message' , mes)
      })
      

      this.socket.on("connect_error", (err) => {
        console.log("Connection error:", this.socket);
        console.error("Socket connection error:", err);
      });

    this.socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    
    // if (!this.socket) {
    //   this.socket = io("https://16qldnx9-5000.inc1.devtunnels.ms", {
    //     transports: ["websocket"],
    //     query: {
    //       token: token
          
    //     },
    //     auth: {
    //       token: token
    //     },
    //     reconnection: true,
    //     reconnectionAttempts: 5,
    //     autoConnect: true,
    //   });

    //   this.socket.on("connect", () => {
    //     console.log("Socket connected:", this.socket.id);
    //   });

    //   this.socket.on('new_message' , (message) => {
    //     console.log(message)
        
    //   })

    //   this.socket.on("connect_error", (err) => {
    //     console.log("Connection error:", this.socket);
    //     console.error("Socket connection error:", err);
    //   });

    //   this.socket.on("disconnect", () => {
    //     console.log("Socket disconnected");
    //   });
    // }
  }
  emit(event, data){
    this.socket?.emit(event, data);

  }

  on(event, callback) {
    this.socket?.on(event, callback);
  }

  off(event, callback) {
    this.socket?.off(event, callback);
  }

  leaveChat(chat_id) {
    this.emit("leave_chat", { chat_id });
  }

  disconnect(){
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // on(event, callback) {
  //   if (this.socket) {
  //     this.socket.on(event, callback);
  //   }
  // }

  // off(event, callback) {
  //   if (this.socket) {
  //     this.socket.off(event, callback);
  //   }
  // }

  // disconnect() {
  //   if (this.socket) {
  //     this.socket.disconnect();
  //     console.log("Socket disconnected via disconnect method");
  //     console.log("disconneted",this.socket);
  //     this.socket = null;
  //   }
  // }
}

export default new SocketService();

// this.socket = io("http://localhost:3000", {
//   transports: ["websocket"],
//   auth: {
//     token: localStorage.getItem("token"),
//   },
//   reconnection: true,
//   reconnectionAttempts: 5,
// });