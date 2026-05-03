import { messageModel } from "../../../db/models/chat.model.js";
import { getRoomId } from "./room.util.js";

export const chatSocket = (io) => {

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    socket.on("join-chat", ({ userB }) => {
      //const sender = socket.user.id;
      const sender = socket.user._id;
      const roomId = getRoomId(sender, userB);
      socket.join(roomId);
      console.log("Joined chat room:", roomId);
    });

    socket.on("send-message", async (data) => {
      const { receiver, msg } = data;
      //const sender = socket.user.id;
      const sender = socket.user._id;

      const roomId = getRoomId(sender, receiver);

      const message = await messageModel.create({
        roomId,
        senderId: sender,
        content: msg
      });

      io.to(roomId).emit("receive-message", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

  });
};