import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

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
  stock: Number,
});

const Cart = mongoose.model("Cart", cartSchema);
const Product = mongoose.model("Product", productSchema);

async function fixCartQuantities() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected\n");

  const carts = await Cart.find().lean();
  let fixedCount = 0;

  for (const cart of carts) {
    let needsSave = false;
    const updatedItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product).lean();
      if (product && item.quantity > product.stock) {
        console.log(`  Fixing "${item.name}": quantity ${item.quantity} → ${product.stock} (stock limit)`);
        updatedItems.push({ ...item, quantity: product.stock });
        needsSave = true;
        fixedCount++;
      } else {
        updatedItems.push(item);
      }
    }

    if (needsSave) {
      await Cart.findByIdAndUpdate(cart._id, { items: updatedItems });
      console.log(`  ✅ Cart ${cart._id} updated.\n`);
    }
  }

  console.log(`\n✅ Done. Fixed ${fixedCount} item(s).`);
  await mongoose.disconnect();
}

fixCartQuantities().catch(console.error);
