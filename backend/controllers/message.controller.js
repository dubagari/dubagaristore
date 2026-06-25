import Message from "../models/Message.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc    Get all unique chat rooms (active conversations)
// @route   GET /api/messages/rooms
// @access  Private/Admin
export const getChatRooms = asyncHandler(async (req, res) => {
  const rooms = await Message.aggregate([
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$room",
        latestMessage: { $first: "$$ROOT" },
      },
    },
    { $sort: { "latestMessage.createdAt": -1 } },
  ]);

  res.status(200).json({ success: true, count: rooms.length, data: rooms });
});

// @desc    Get chat history for a specific room
// @route   GET /api/messages/history/:room
// @access  Private
export const getChatHistory = asyncHandler(async (req, res) => {
  const history = await Message.find({ room: req.params.room }).sort({ createdAt: 1 });
  res.status(200).json({ success: true, count: history.length, data: history });
});
