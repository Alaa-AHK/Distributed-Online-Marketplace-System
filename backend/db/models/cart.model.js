import mongoose from 'mongoose';
import { connections } from '../config/db.js';

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity:  { type: Number, default: 1 }
  }]
}, { timestamps: true });

export const cartModel = connections.productDB.model('Cart', cartSchema);