class WebSockets {
    users = [];//lists all active users
    connection(contacts) {
      // event fired when the chat room is disconnected
      contacts.on("disconnect", () => {
        this.users = this.users.filter((user) => user.socketId !== contacts.id);
      });
      // add identity of user mapped to the socket id when logs in frm FE
      contacts.on("identity", (userId) => {
        this.users.push({
          socketId: contacts.id,
          userId: userId,
        });
      });
      // subscribe person to chat & other user as well
      contacts.on("subscribe", (room, otherUserId = "") => {
        this.subscribeOtherUser(room, otherUserId);
        contacts.join(room);
      });
      // mute a chat room
      contacts.on("unsubscribe", (room) => {
        contacts.leave(room);
      });
    }
  
    subscribeOtherUser(room, otherUserId) {
      const userSockets = this.users.filter(
        (user) => user.userId === otherUserId
      );
      userSockets.map((userInfo) => {
        const socketConn = global.io.sockets.connected(userInfo.socketId);
        if (socketConn) {
          socketConn.join(room);
        }
      });
    }
  }
  
  export default new WebSockets();
  