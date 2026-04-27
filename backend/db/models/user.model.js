import { model, Schema } from "mongoose";

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    userName: String,
    age: Number,

   role: {
    type: [String],
    enum: ["seller", "buyer", "admin"],
    default: ["buyer"]
},

    isConfirmed: {
        type: Boolean,
        default: false
    },

    balance: {
        type: Number,
        default: 0
    },

    phone: String,
    address: String

}, {
    timestamps: true,
    versionKey: false
});

export const userModel = model("user", userSchema);