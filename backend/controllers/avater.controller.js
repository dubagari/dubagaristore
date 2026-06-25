import User from "../models/User.js";

export const avatercontroller = async (req, res) => {
  try {
    const userId = req.params.id;

    console.log("USER ID:", userId);

    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const avatarUrl = req.file.path;

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { returnDocument: "after" },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "Avatar updated successfully",
      user,
    });
  } catch (err) {
    console.error("AVATAR ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "No images uploaded",
      });
    }

    const imageUrls = req.files.map((file) => file.path);

    res.status(200).json({
      images: imageUrls,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
