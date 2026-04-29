import { messageModel } from "./chat.model.js";
import { getRoomId } from "./room.util.js";

export const chatSocket = (io) => {

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    // user joins chat with another user
    socket.on("join-chat", ({ userA, userB }) => {
      const roomId = getRoomId(userA, userB);
      socket.join(roomId);

      console.log("Joined chat room:", roomId);
    });

    // send message
    socket.on("send-message", async (data) => {
      const { sender, receiver, msg } = data;

      const roomId = getRoomId(sender, receiver);

      const message = await messageModel.create({
        roomId,
        senderId: sender,
        content: msg
      });

      // send to both users in room
      io.to(roomId).emit("receive-message", message);
    });

  });
};