import React, { useEffect, useState } from "react";
import Shopcommon from "../UI/Shopcommon";
import Productlist from "../UI/Productlist";
// import { useSearchParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Shop = () => {
  const [productData, setProductData] = useState([]);
  const [dbProducts, setDbProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 12;

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products?page=${page}&limit=${limit}`,
        );

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const json = await res.json();

        if (json.success) {
          const mapped = json.data.map((p) => ({
            _id: p._id,
            name: p.name,
            image: p.images?.[0] || "",
            category: p.category,
            price: p.price,
            description: p.description,
            shortDesc: p.shortDesc,
            reviews: p.reviews || [],
            avgRating: p.avgRating || 0,
          }));

          setDbProducts(mapped);
          setPages(json.pages);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [categoryFilter, searchTerm, sortOrder]);
  // Filter, Search, and Sort combined logic
  useEffect(() => {
    let filtered = [...dbProducts];

    // Category Filter
    if (categoryFilter !== "all" && categoryFilter !== "") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    // Search Query Filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((item) => {
        const name = item.productName || item.name || "";
        return name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Pricing Sorting Filter
    if (sortOrder === "ascending") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "descending") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setProductData(filtered);
  }, [categoryFilter, sortOrder, searchTerm, dbProducts]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen pb-20 transition-colors duration-200">
      <Shopcommon title="Shop Catalog" />

      {/* Filter Toolbar Controls */}
      <section className="py-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-6 justify-between items-stretch md:items-center">
          {/* Select Category */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <select
                onChange={(e) => setCategoryFilter(e.target.value)}
                value={categoryFilter}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold outline-none focus:border-purple-500 focus:bg-white dark:text-slate-200 transition-colors cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="hp">HP Computers</option>
                <option value="apple">Apple Laptops</option>
                <option value="headphone">Headphones</option>
                <option value="iphones">iPhones</option>
                <option value="samsung">Samsung</option>
                <option value="watch">Watches</option>
              </select>
            </div>

            {/* Sort Price */}
            <div className="relative flex-1">
              <select
                onChange={(e) => setSortOrder(e.target.value)}
                value={sortOrder}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold outline-none focus:border-purple-500 focus:bg-white dark:text-slate-200 transition-colors cursor-pointer"
              >
                <option value="">Sort by Price</option>
                <option value="ascending">Ascending</option>
                <option value="descending">Descending</option>
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative max-w-sm w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-lg">
              <i className="ri-search-line"></i>
            </span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:border-purple-500 focus:bg-white dark:text-slate-200 dark:focus:bg-slate-950/80 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Products list grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {loading ? (
            <p className="text-center font-bold text-slate-400 animate-pulse py-10">
              Loading products...
            </p>
          ) : productData.length === 0 ? (
            <div className="text-center py-20 space-y-2">
              <div className="text-4xl text-slate-300">
                <i className="ri-inbox-line"></i>
              </div>
              <h3 className="text-lg font-bold text-slate-500">
                No products found
              </h3>
              <p className="text-sm text-slate-400">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
            //   <Productlist data={productData} />
            // </div>
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <Productlist data={productData} />
              </div>

              {/* Pagination */}
              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
                  <button
                    onClick={() => setPage((prev) => prev - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-purple-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>

                  {Array.from({ length: pages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setPage(index + 1)}
                      className={`w-10 h-10 rounded-lg font-semibold transition ${
                        page === index + 1
                          ? "bg-purple-600 text-white"
                          : "bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-purple-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={page === pages}
                    className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-purple-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
