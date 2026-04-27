import mongoose from 'mongoose';
import { connections } from '../config/db.js';

const productSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  brand:       { type: String },
  price:       { type: Number, required: true },
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // ← controller uses "owner"
  status:      { type: String, enum: ['available', 'sold'], default: 'available' },
  ratings:     [{ userId: mongoose.Schema.Types.ObjectId, rating: Number, comment: String }],
}, { timestamps: true });

export const productModel = connections.productDB.model('Product', productSchema);