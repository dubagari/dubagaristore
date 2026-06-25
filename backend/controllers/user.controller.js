import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password").sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: users.length, data: users });
});
