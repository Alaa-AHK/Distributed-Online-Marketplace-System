import mongoose from 'mongoose';
import { connections } from '../config/db.js';

const messageSchema = new mongoose.Schema({
  roomId:   { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  content:  { type: String, required: true },
}, { timestamps: true });

export const messageModel = connections.chatDB.model('Message', messageSchema);