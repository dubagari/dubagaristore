import express from "express";
import cors from "cors";
import dotenv from "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import dashboardRoutes from "./routes/dashboard.routes.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import avaterRoutes from "./routes/avater.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import { connectDB } from "./config/db.js";
import Message from "./models/Message.js";
import path from "path";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);


const __dirname = path.resolve();

await connectDB();

const app = express();

// middleware
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users", avaterRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);

// error middleware
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_room", ({ room }) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on("send_message", async ({ senderId, senderName, text, room }) => {
    try {
      const newMessage = await Message.create({
        senderId,
        senderName,
        text,
        room,
      });

      io.to(room).emit("receive_message", newMessage);
      io.emit("update_room_list", { room, latestMessage: newMessage });
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
