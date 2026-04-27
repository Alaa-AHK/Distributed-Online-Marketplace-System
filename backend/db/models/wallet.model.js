import mongoose from 'mongoose';
import { connections } from '../config/db.js';

const walletSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  balance: { type: Number, default: 0 },
}, { timestamps: true });

export const walletModel = connections.paymentDB.model('Wallet', walletSchema);