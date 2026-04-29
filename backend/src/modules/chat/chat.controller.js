import { messageModel } from "../../../db/models/chat.model.js";


 const getMessages = async (req, res) => {
  try {
    const { roomId } = req.query;

    if (!roomId) {
      return res.status(400).json({ message: "roomId is required" });
    }

    const messages = await messageModel.find({ roomId })
      .sort({ createdAt: 1 });

    return res.status(200).json(messages);

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
export {getMessages};