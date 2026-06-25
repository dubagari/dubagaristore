import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [users, products, orders, revenueResult] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      {
        $match: {
          status: { $ne: "cancelled" },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]),
  ]);

  const totalRevenue = revenueResult[0]?.totalRevenue || 0;

  res.status(200).json({
    success: true,
    data: {
      users,
      products,
      orders,
      totalRevenue,
    },
  });
});
