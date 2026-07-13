import mongoose from "mongoose";
import dns from "node:dns";
import dotenv from "dotenv";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const orderSchema = new mongoose.Schema({
  status: String,
  paymentMethod: String,
  isPaid: Boolean,
  shippingAddress: Object,
  orderItems: Array,
  totalPrice: Number,
  paymentStatus: String,
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

async function checkOrder() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected\n");

  const orderId = process.argv[2] || "6a552025c09a2dbecc4b5321";
  const order = await Order.findById(orderId).lean();

  if (!order) {
    console.log("❌ Order not found!");
  } else {
    console.log("=== ORDER ===");
    console.log(`  _id           : ${order._id}`);
    console.log(`  status        : "${order.status}"`);
    console.log(`  paymentMethod : "${order.paymentMethod}"`);
    console.log(`  isPaid        : ${order.isPaid}`);
    console.log(`  paymentStatus : "${order.paymentStatus}"`);
    console.log(`  totalPrice    : ${order.totalPrice}`);
    console.log(`  createdAt     : ${order.createdAt}`);
    console.log(`  orderItems    : ${JSON.stringify(order.orderItems, null, 2)}`);
  }

  await mongoose.disconnect();
}

checkOrder().catch(console.error);
