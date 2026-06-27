import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const productSchema = new mongoose.Schema({
  name: String,
  images: [String],
  price: Number,
  stock: Number,
});

const Product = mongoose.model("Product", productSchema);

async function checkStock() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB\n");

  const products = await Product.find().lean();
  console.log("=== ALL PRODUCTS & STOCK ===");
  products.forEach((p) => {
    const status = p.stock > 0 ? "✅ IN STOCK" : "❌ OUT OF STOCK";
    console.log(`  Name: ${p.name}`);
    console.log(`  Stock: ${p.stock}  ${status}`);
    console.log(`  ID: ${p._id}`);
    console.log("---");
  });

  await mongoose.disconnect();
}

checkStock().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
