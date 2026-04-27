import mongoose from 'mongoose';
import { connections } from '../config/db.js';

const inventorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  quantity:  { type: Number, required: true, default: 0 },
}, { timestamps: true });

export const inventoryModel = connections.inventoryDB.model('Inventory', inventorySchema);