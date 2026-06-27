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

  const normalizedCategory = category?.toLowerCase().trim();

  const allowedCategories = ["hp", "apple", "watch", "smartwatch"];

if (!allowedCategories.includes(normalizedCategory)) {
  res.status(400);
  throw new Error("Invalid category. Use hp, apple, watch, smartwatch");
}

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
    category: normalizedCategory,
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



// export const getProducts = asyncHandler(async (req, res) => {
//   const page = Number(req.query.page) || 1;
//   const limit = Number(req.query.limit) || 12;

//   // Build filter object
//   const filter = {};

//   // Search
//   if (req.query.keyword) {
//     filter.name = {
//       $regex: req.query.keyword,
//       $options: "i",
//     };
//   }

//   // Category
//   if (req.query.category && req.query.category !== "all") {
//     filter.category = req.query.category;
//   }

//   // Sorting
//   let sort = { createdAt: -1 };

//   if (req.query.sort === "ascending") {
//     sort = { price: 1 };
//   } else if (req.query.sort === "descending") {
//     sort = { price: -1 };
//   }

//   const count = await Product.countDocuments(filter);

//   const products = await Product.find(filter)
//     .sort(sort)
//     .skip((page - 1) * limit)
//     .limit(limit);

//   res.status(200).json({
//     success: true,
//     count,
//     page,
//     pages: Math.ceil(count / limit),
//     data: products,
//   });
// });


export const getProducts = asyncHandler(async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 12, 1);

    const filter = {};

    // Search
    if (req.query.keyword?.trim()) {
      filter.name = {
        $regex: req.query.keyword.trim(),
        $options: "i",
      };
    }

    // Category
    if (req.query.category && req.query.category !== "all") {
      filter.category = req.query.category;
    }

    // Sorting
    let sort = { createdAt: -1 };

    if (req.query.sort === "ascending") sort = { price: 1 };
    if (req.query.sort === "descending") sort = { price: -1 };

    const count = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      count,
      page,
      pages: Math.ceil(count / limit),
      data: products,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
});

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
