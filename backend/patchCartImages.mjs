import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Minimal schemas needed for the patch
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

const productSchema = new mongoose.Schema({
  name: String,
  images: [String],
  price: Number,
});

const Cart = mongoose.model("Cart", cartSchema);
const Product = mongoose.model("Product", productSchema);

async function patchCartImages() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB\n");

  const carts = await Cart.find().lean();
  let fixedCount = 0;

  for (const cart of carts) {
    let needsSave = false;
    const updatedItems = [];

    for (const item of cart.items) {
      // Check if image is missing or is the string "undefined"
      if (!item.image || item.image === "undefined") {
        const product = await Product.findById(item.product).lean();
        if (product && product.images?.length > 0) {
          console.log(`  Fixing "${item.name}" → ${product.images[0]}`);
          updatedItems.push({ ...item, image: product.images[0] });
          needsSave = true;
          fixedCount++;
        } else {
          updatedItems.push(item);
          console.log(`  ⚠️  No product found for "${item.name}" (${item.product})`);
        }
      } else {
        updatedItems.push(item);
      }
    }

    if (needsSave) {
      await Cart.findByIdAndUpdate(cart._id, { items: updatedItems });
      console.log(`  ✅ Cart ${cart._id} updated.\n`);
    }
  }

  console.log(`\n✅ Done. Fixed ${fixedCount} cart item(s).`);
  await mongoose.disconnect();
}

patchCartImages().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
