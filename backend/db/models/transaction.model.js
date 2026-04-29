import mongoose from 'mongoose';
import { connections } from '../config/db.js';

const transactionSchema = new mongoose.Schema({
  buyer:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // ← controller uses "buyer"
  seller:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // ← controller uses "seller"
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },// ← controller uses "product"
  price:   { type: Number, required: true },                         // ← controller uses "price"
}, { timestamps: true });

export const transactionModel = connections.paymentDB.model('Transaction', transactionSchema);