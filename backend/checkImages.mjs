import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const productSchema = new mongoose.Schema({
  name: String,
  images: [String],
  price: Number,
});

const cartItemSchema = new mongoose.Schema({
  product: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number,
  quantity: Number,
  image: String,
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user: mongoose.Schema.Types.ObjectId,
  items: [cartItemSchema],
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
const Cart = mongoose.model("Cart", cartSchema);

async function checkDB() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB\n");

  // Check Products
  console.log("=== PRODUCTS (first 5) ===");
  const products = await Product.find().limit(5).lean();
  products.forEach((p) => {
    console.log(`  Name: ${p.name}`);
    console.log(`  Images: ${JSON.stringify(p.images)}`);
    console.log("---");
  });

  // Check Carts
  console.log("\n=== CART ITEMS (all carts) ===");
  const carts = await Cart.find().lean();
  if (carts.length === 0) {
    console.log("  No carts found in DB.");
  } else {
    carts.forEach((cart) => {
      console.log(`Cart user: ${cart.user}`);
      cart.items.forEach((item) => {
        console.log(`  Product: ${item.name}`);
        console.log(`  Image stored: "${item.image}"`);
        console.log(`  Has image: ${!!item.image}`);
        console.log("  ---");
      });
    });
  }

  await mongoose.disconnect();
  console.log("\n✅ Done.");
}

checkDB().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
