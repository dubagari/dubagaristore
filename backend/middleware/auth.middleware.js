import jwt from "jsonwebtoken";
import User from "../models/User.js";

// export const protect = async (req, res, next) => {
//   try {
//     let token;

//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//     ) {
//       token = req.headers.authorization.split(" ")[1];

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.id).select("-password");

//       return next();
//     }
//     res.status(401).json({
//       message: "No Authorization header received",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(401).json({
//       message: "Not authorized",
//     });
//   }
// };




export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({
        message: "Not authorized, invalid token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    console.error("Admin access required");
    res.status(403).json({ message: "Admin access required" });
  }
};
