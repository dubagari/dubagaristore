import Order from "../models/Order.js";
import Product from "../models/Product.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("orderItems.product", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

// @access  User
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    data: orders,
  });
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private

export const createOrder = asyncHandler(async (req, res) => {
  console.log(req.body);
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    shippingPrice = 0,
    taxPrice = 0,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  let itemsPrice = 0;

  for (const item of orderItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }

    console.log("Product:", product.name);
    console.log("Database stock:", product.stock);
    console.log("Requested quantity:", item.quantity);

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`${product.name} is out of stock`);
    }

    itemsPrice += product.price * item.quantity;

    // Reserve stock immediately for COD orders
    if (paymentMethod === "Cash on Delivery") {
      product.stock -= item.quantity;
      await product.save();
    }
  }
console.log(orderItems);
  const totalPrice = itemsPrice + Number(shippingPrice) + Number(taxPrice);

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentStatus: "pending",
    isPaid: false,
  });

  res.status(201).json({
    success: true,
    data: order,
  });
});
// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const status = req.body.status?.toLowerCase();

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Prevent unpaid Paystack orders from being processed (except cancellation)
  if (order.paymentMethod === "Paystack" && !order.isPaid && status !== "cancelled") {
    res.status(400);
    throw new Error("Order payment has not been completed");
  }

  const transitions = {
    pending: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
  };

  const currentStatus = order.status;

  if (!transitions[currentStatus]?.includes(status)) {
    res.status(400);
    throw new Error(`Cannot change status from ${currentStatus} to ${status}`);
  }

  order.status = status;

  if (status === "delivered") {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }

  if (status === "cancelled") {
    order.isDelivered = false;

    // Restore stock only when cancelling
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);

      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
  }

  await order.save();

  res.status(200).json({
    success: true,
    data: order,
  });
});

// controllers/order.controller.js

export const verifyPaystackPayment = asyncHandler(async (req, res) => {
  const { reference } = req.body;
  const orderId = req.params.id;

  console.log("orderId:", orderId);
  console.log("reference:", reference);

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // ✅ Fix: actually call Paystack verify API instead of using undefined variable
  const paystackRes = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  const paystackData = await paystackRes.json();

  if (!paystackData.status || paystackData.data?.status !== "success") {
    res.status(400);
    throw new Error("Payment verification failed");
  }

  const paystack = paystackData.data;

  order.paymentStatus = "paid";
  order.isPaid = true;
  order.paidAt = new Date();

  order.paymentResult = {
    reference: paystack.reference,
    transactionId: paystack.id,
    channel: paystack.channel,
    currency: paystack.currency,
    amount: paystack.amount,
  };

  await order.save();

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    data: order,
  });
});

// @desc    Mark order as paid
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin

export const markOrderAsPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error("Order already paid");
  }

  order.isPaid = true;
  order.paymentStatus = "paid";
  order.paidAt = new Date();

  order.paymentResult = {
    method: order.paymentMethod,
    reference: `COD-${Date.now()}`,
  };

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order marked as paid",
    data: order,
  });
});
