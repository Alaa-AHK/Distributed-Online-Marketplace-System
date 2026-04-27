import { Schema, model } from "mongoose";

const transactionSchema = new Schema({
    buyer: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    seller: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    product: {
        type: Schema.Types.ObjectId,
        ref: "product",
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["completed", "cancelled"],
        default: "completed"
    }

}, {
    timestamps: true,
    versionKey: false
});

export const transactionModel = model("transaction", transactionSchema);