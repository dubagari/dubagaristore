

import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      default: "",
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: {
      type: [orderItemSchema],
      required: true,
    },

    shippingAddress: {
      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      country: {
        type: String,
        required: true,
      },

      postalCode: {
        type: String,
        required: true,
      },
    },

    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "Paystack", "Bank Transfer"],
      required: true,
    },

    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    taxPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,

    paymentResult: {
      method: String,
      status: String,
      reference: String,
      transactionId: String,
      channel: String,
      currency: String,
      amount: Number,
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: Date,

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    cancelledAt: Date,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Order", orderSchema);
