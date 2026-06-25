import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Package,
  Search,
  Plus,
  Trash2,
  Edit,
  AlertCircle,
  X,
  Check,
} from "lucide-react";
import Table from "../components/ui/Table";
import {
  deleteProduct,
  selectFilteredProducts,
  selectProductsError,
  selectProductsLoading,
  selectProductsStats,
  selectSearchQuery,
  selectSortDirection,
  selectSortKey,
  selectStatusFilter,
  setSearchQuery,
  setSorting,
  setStatusFilter,
} from "../redux/slices/productsSlice";
import {
  createProduct,
  fetchProducts,
  removeProduct,
  updateProduct,
} from "../redux/slices/productsThunk";

const Product = () => {
  const dispatch = useDispatch();

  // Redux-connected states and pre-filtered data
  const filteredProducts = useSelector(selectFilteredProducts);
  const searchQuery = useSelector(selectSearchQuery);
  const statusFilter = useSelector(selectStatusFilter);
  const sortKey = useSelector(selectSortKey);
  const sortDirection = useSelector(selectSortDirection);
  const stats = useSelector(selectProductsStats);

  console.log(stats);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const token = localStorage.getItem("token");

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    shortDesc: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
    images: [],
    isNewArrival: false,
  });

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    setUploading(true);

    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch(
        "http://localhost:5000/api/products/upload-images",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setNewProduct((prev) => ({
        ...prev,
        images: data.images,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);

      e.target.value = "";
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.stock ||
      !newProduct.brand ||
      !newProduct.category ||
      !newProduct.description ||
      !newProduct.shortDesc
    )
      return;

    const priceNum = parseFloat(newProduct.price);
    const stockNum = parseInt(newProduct.stock);

    let status = "In Stock";
    if (stockNum === 0) status = "Out of Stock";
    else if (stockNum <= 10) status = "Low Stock";

    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        shortDesc: newProduct.shortDesc,
        category: newProduct.category,
        brand: newProduct.brand,
        price: priceNum,
        stock: stockNum,
        status,
        images: newProduct.images,
        isNewArrival: newProduct.isNewArrival,
      };

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // Reset form
      setNewProduct({
        name: "",
        description: "",
        shortDesc: "",
        category: "",
        brand: "",
        price: "",
        stock: "",
        images: [],
        isNewArrival: false,
      });

      setIsModalOpen(false);
    } catch (error) {
      console.error("Add product error:", error);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    const priceNum = parseFloat(newProduct.price);
    const stockNum = parseInt(newProduct.stock);

    let status = "In Stock";

    if (stockNum === 0) status = "Out of Stock";
    else if (stockNum <= 10) status = "Low Stock";

    const productData = {
      ...newProduct,
      price: priceNum,
      stock: stockNum,
      status,
      isNewArrival: newProduct.isNewArrival,
    };

    try {
      if (editingProduct) {
        await dispatch(
          updateProduct({
            id: editingProduct._id,
            productData,
          }),
        ).unwrap();
      } else {
        await dispatch(createProduct(productData)).unwrap();
      }
      setEditingProduct(null);
      setNewProduct({
        name: "",
        description: "",
        shortDesc: "",
        category: "",
        brand: "",
        price: "",
        stock: "",
        image: [],
        isNewArrival: false,
      });

      setEditingProduct(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSortClick = (key) => {
    dispatch(setSorting(key));
  };

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const columns = [
    {
      key: "images",
      header: "Image",
      sortable: false,
      render: (row) => {
        const image =
          Array.isArray(row.images) && row.images.length > 0
            ? row.images[0]
            : "/placeholder.png";
        console.log(image);

        return (
          <img
            src={image}
            alt={row.name}
            className="h-12 w-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
          />
        );
      },
    },
    { key: "name", header: "Name" },
    { key: "category", header: "Category" },
    {
      key: "price",
      header: "Price",
      render: (row) => <span>${parseFloat(row.price).toFixed(2)}</span>,
    },
    {
      key: "stock",
      header: "Stock Qty",
      render: (row) => (
        <span
          className={`font-semibold ${row.stock === 0 ? "text-rose-500" : row.stock <= 10 ? "text-amber-500" : "text-slate-600 dark:text-slate-350"}`}
        >
          {row.stock} units
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        let colors =
          "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
        if (row.status === "In Stock")
          colors =
            "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400";
        else if (row.status === "Low Stock")
          colors =
            "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400";
        else if (row.status === "Out of Stock")
          colors =
            "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-450";

        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors}`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            title="Edit Product"
            onClick={() => {
              setEditingProduct(row);
              setNewProduct({
                name: row.name || "",
                description: row.description || "",
                shortDesc: row.shortDesc || "",
                category: row.category || "",
                brand: row.brand || "",
                price: row.price || "",
                stock: row.stock || "",
                images: Array.isArray(row.images)
                  ? row.images
                  : Array.isArray(row.images)
                    ? row.images
                    : [],
                isNewArrival: row.isNewArrival || false,
              });
              setIsModalOpen(true);
            }}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-850 dark:border-slate-800 dark:text-slate-404 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
          <button
            title="Delete Product"
            onClick={() => dispatch(removeProduct(row._id))}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-rose-650 hover:bg-rose-55 dark:border-slate-800 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 sm:text-2xl">
            Product Catalog
          </h2>
          <p className="text-sm text-slate-450">
            Manage inventory items, pricing schemas, and stock notifications
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);

            setNewProduct({
              name: "",
              description: "",
              shortDesc: "",
              category: "",
              brand: "",
              price: "",
              stock: "",
              images: [],
              isNewArrival: false,
            });

            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-650/20 hover:bg-purple-700 hover:shadow-lg transition-all duration-200"
        >
          <Plus className="h-4.5 w-4.5" />
          Add Product
        </button>
      </div>

      {/* Stock Cards Row */}
      <div className="grid  gap-4 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 flex items-center justify-center">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400">
              Total Items
            </span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {stats.total}
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center">
            <Check className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400">
              In Stock
            </span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {stats.inStock}
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 flex items-center justify-center">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400">
              Low Stock
            </span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {stats.lowStock}
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-455 flex items-center justify-center">
            <Trash2 className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400">
              Out of Stock
            </span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {stats.outOfStock}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search products by ID, name, category..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-xs outline-none focus:border-purple-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-purple-400"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
          {["All", "In Stock", "Low Stock", "Out of Stock"].map((tabName) => (
            <button
              key={tabName}
              onClick={() => dispatch(setStatusFilter(tabName))}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === tabName
                  ? "bg-white text-purple-650 shadow-sm dark:bg-slate-800 dark:text-purple-400"
                  : "text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {tabName}
            </button>
          ))}
        </div>
      </div>

      {/* Main product catalog data */}
      <Table
        columns={columns}
        data={filteredProducts || []}
        itemsPerPage={5}
        onSort={handleSortClick}
        sortKey={sortKey}
        sortDirection={sortDirection}
      />

      {/* Add Product Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-slate-955/40 backdrop-blur-sm"
          />

          {/* Form Modal Box */}
          <div className="relative w-full max-w-md mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-955 animate-slideUp">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-605 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Specify inventory details to publish new catalog item
            </p>

            <form
              onSubmit={handleSaveProduct}
              className="space-y-4 text-xs font-semibold"
            >
              {/* Product Name */}
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1.5">
                  Product Name
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Noise Cancelling Headphones"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 outline-none focus:bg-white focus:border-purple-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1.5">
                  Description
                </label>

                <textarea
                  rows={4}
                  required
                  placeholder="Enter full product description"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 outline-none focus:bg-white focus:border-purple-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1.5">
                  Short Description
                </label>

                <textarea
                  rows={2}
                  placeholder="Brief summary for product cards"
                  value={newProduct.shortDesc}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      shortDesc: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 outline-none focus:bg-white focus:border-purple-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                />
              </div>

              {/* Category + Brand */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1.5">
                    Category
                  </label>

                  <select
                    required
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        category: e.target.value,
                      })
                    }
                    className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 outline-none focus:bg-white focus:border-purple-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value="">All Categories</option>
                    <option value="hp">HP Computers</option>
                    <option value="apple">Apple Laptops</option>
                    <option value="headphone">Headphones</option>
                    <option value="iphones">iPhones</option>
                    <option value="samsung">Samsung</option>
                    <option value="watch">Watches</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1.5">
                    Brand
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="e.g. Apple"
                    value={newProduct.brand}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        brand: e.target.value,
                      })
                    }
                    className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 outline-none focus:bg-white focus:border-purple-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1.5">
                    Price ($ USD)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="99.99"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price: e.target.value,
                      })
                    }
                    className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 outline-none focus:bg-white focus:border-purple-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1.5">
                    Stock Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="50"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        stock: e.target.value,
                      })
                    }
                    className="w-full h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 outline-none focus:bg-white focus:border-purple-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-slate-500 dark:text-slate-400 mb-1.5">
                  Product Images
                </label>

                <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-6 transition hover:border-purple-500 dark:border-slate-700">
                  <span className="text-sm text-slate-500">
                    {uploading ? "Uploading..." : "Click to upload images"}
                  </span>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>

                {Array.isArray(newProduct.images) &&
                  newProduct.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {(newProduct.images || []).map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Preview ${index + 1}`}
                          className="h-20 w-full rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}
              </div>

              {/* New Arrival Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isNewArrival"
                  checked={newProduct.isNewArrival}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, isNewArrival: e.target.checked })
                  }
                  className="w-4 h-4 text-purple-600 bg-slate-100 border-slate-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer"
                />
                <label htmlFor="isNewArrival" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Mark as New Arrival
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-650/10"
                >
                  {editingProduct ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
