import Cart from "../models/cartModel.js";
import Product from "../models/Product.js";


/**
 * GET CART
 */
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      // ✅ Fix: cap quantity at available stock
      if (newQuantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} unit(s) of "${product.name}" available in stock.`,
        });
      }
      existingItem.quantity = newQuantity;
    } else {
      // ✅ Fix: validate stock before adding new item
      if (quantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} unit(s) of "${product.name}" available in stock.`,
        });
      }
      cart.items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images?.[0] || "",
      });
    }

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // ✅ Fix: validate against stock before updating quantity
    const product = await Product.findById(productId).lean();
    if (product && quantity > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} unit(s) of "${product.name}" available in stock.`,
      });
    }

    item.quantity = quantity;

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    return res.json({
      items: cart.items,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );

    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};