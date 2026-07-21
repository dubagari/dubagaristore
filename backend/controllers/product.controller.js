import Product from "../models/Product.js";
import asyncHandler from "../middleware/asyncHandler.js";

// @desc Add a product
//  // @route POST /api/products
// // @access Private/Admin
export const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    shortDesc,
    category,
    brand,
    price,
    stock,
    images,
    isNewArrival,
  } = req.body;

  if (
    !name ||
    !description ||
    !shortDesc ||
    !category ||
    !images ||
    price === undefined ||
    stock === undefined
  ) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }
  const product = await Product.create({
    name,
    description,
    shortDesc,
    category,
    brand,
    price,
    stock,
    images,
    isNewArrival,
  });

  res.status(201).json({
    success: true,
    data: product,
  });
});

// export const createProduct = async (req, res) => {
//   console.log("BODY:", req.body);
//   try {
//     const {
//       name,
//       description,
//       shortDesc,
//       category,
//       brand,
//       price,
//       stock,
//       status,
//       images,
//     } = req.body;

//     if (
//       !name ||
//       !description ||
//       !shortDesc ||
//       !category ||
//       !images ||
//       price === undefined ||
//       stock === undefined
//     ) {
//       res.status(400);
//       throw new Error("Please provide all required fields");
//     }

//     const product = await Product.create({
//       name,
//       description,
//       shortDesc,
//       category,
//       brand,
//       price,
//       stock,
//       status,
//       images,
//     });

//     res.status(201).json(product);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };
// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = req.query.limit ? Number(req.query.limit) : null;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments(keyword);

  let query = Product.find(keyword).sort({ createdAt: -1 });

  if (limit) {
    query = query.skip((page - 1) * limit).limit(limit);
  }

  const products = await query;

  res.status(200).json({
    success: true,
    count,
    page,
    pages: limit ? Math.ceil(count / limit) : 1,
    data: products,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    shortDesc,
    category,
    brand,
    price,
    stock,
    status,
    images,
    isNewArrival,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.name = name || product.name;
  product.description = description || product.description;
  product.category = category || product.category;
  product.price = price !== undefined ? price : product.price;
  product.stock = stock !== undefined ? stock : product.stock;
  product.images = images || product.images;
  product.shortDesc = shortDesc || product.shortDesc;
  product.brand = brand || product.brand;
  product.isNewArrival = isNewArrival !== undefined ? isNewArrival : product.isNewArrival;

  const updatedProduct = await product.save();
  res.status(200).json({ success: true, data: updatedProduct });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.status(200).json({ success: true, message: "Product removed" });
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment, name } = req.body;

  if (!rating || !comment) {
    res.status(400);
    throw new Error("Please provide a rating and comment");
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: name || req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.avgRating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ success: true, message: "Review added", data: product });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
