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

async function diagnose() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected\n");

  const carts = await Cart.find().lean();
  for (const cart of carts) {
    console.log(`=== Cart for user: ${cart.user} ===`);
    for (const item of cart.items) {
      console.log(`  Item name      : ${item.name}`);
      console.log(`  item.product   : ${item.product} (type: ${typeof item.product})`);
      console.log(`  item.quantity  : ${item.quantity} (type: ${typeof item.quantity})`);
      console.log(`  item.price     : ${item.price} (type: ${typeof item.price})`);
      console.log(`  item.image     : ${item.image}`);

      // Simulate what createOrder does
      const product = await Product.findById(item.product).lean();
      if (!product) {
        console.log(`  ❌ Product NOT found in DB for id: ${item.product}`);
      } else {
        console.log(`  ✅ Product found: "${product.name}", stock: ${product.stock}`);
        console.log(`  Stock check: product.stock(${product.stock}) < item.quantity(${item.quantity}) = ${product.stock < item.quantity}`);
        if (product.stock < item.quantity) {
          console.log(`  ❌ Would throw "out of stock" error!`);
        } else {
          console.log(`  ✅ Stock check passes — order should go through.`);
        }
      }
      console.log("---");
    }
  }

  await mongoose.disconnect();
}

diagnose().catch(console.error);
