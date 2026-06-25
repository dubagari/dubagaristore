import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Use full schemas to match exactly what the server does
const orderItemSchema = new mongoose.Schema({ product: mongoose.Schema.Types.ObjectId, name: String, quantity: Number, price: Number, image: String }, { _id: false });

const orderSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
  orderItems: [orderItemSchema],
  shippingAddress: { address: String, city: String, state: String, country: String, postalCode: String },
  paymentMethod: { type: String, enum: ["Cash on Delivery", "Paystack", "Bank Transfer"] },
  itemsPrice: { type: Number, required: true, default: 0, min: 0 },
  shippingPrice: { type: Number, required: true, default: 0, min: 0 },
  taxPrice: { type: Number, required: true, default: 0, min: 0 },
  totalPrice: { type: Number, required: true, default: 0, min: 0 },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  paymentResult: { method: String, status: String, reference: String, transactionId: String, channel: String, currency: String, amount: Number },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date,
  status: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
  cancelledAt: Date,
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

async function simulateStatusUpdate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected\n");

  const orderId = "6a3d036f1268b01ca384ace8";
  const newStatus = "shipped"; // Try moving from processing → shipped

  const order = await Order.findById(orderId);
  if (!order) { console.log("❌ Order not found"); return; }

  console.log("Before update:");
  console.log(`  status: ${order.status}, isPaid: ${order.isPaid}, paymentMethod: ${order.paymentMethod}, paymentStatus: ${order.paymentStatus}`);

  const transitions = {
    pending: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  const statusToTry = newStatus.toLowerCase();
  const currentStatus = order.status;

  if (!transitions[currentStatus]?.includes(statusToTry)) {
    console.log(`❌ Transition BLOCKED: cannot go from "${currentStatus}" → "${statusToTry}"`);
    console.log(`   Allowed from "${currentStatus}": ${JSON.stringify(transitions[currentStatus])}`);
    await mongoose.disconnect();
    return;
  }

  order.status = statusToTry;
  if (statusToTry === "delivered") { order.isDelivered = true; order.deliveredAt = new Date(); }

  try {
    await order.save();
    console.log(`✅ Status updated to "${statusToTry}" successfully`);
  } catch (err) {
    console.log(`❌ Save error: ${err.message}`);
    if (err.errors) {
      Object.keys(err.errors).forEach(k => console.log(`   Field "${k}": ${err.errors[k].message}`));
    }
  }

  await mongoose.disconnect();
}

simulateStatusUpdate().catch(console.error);
