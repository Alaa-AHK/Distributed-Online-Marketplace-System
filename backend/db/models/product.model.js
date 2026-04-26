import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },

    quantity: {
        type: Number,
        default: 1,
        min: 0
    },

    brand: String,

    owner: {
  type: Schema.Types.ObjectId,
  ref: "user",
  required: true
},

status: {
  type: String,
  enum: ["available", "sold"],
  default: "available"
},

    ratings: [
        {
            userId: { type: Schema.Types.ObjectId, ref: "user" },
            rating: { type: Number, min: 0, max: 5 },
            comment: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    discount: { type: Number, default: 0 },

    image: { type: String }

}, {
    timestamps: true,
    versionKey: false
});

export const productModel = model("product", productSchema);