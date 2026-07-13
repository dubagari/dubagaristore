import React, { useEffect, useState } from "react";
import Shopcommon from "../UI/Shopcommon";
import Productlist from "../UI/Productlist";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import { useSearchParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Shop = () => {
  const [productData, setProductData] = useState([]);
  const [dbProducts, setDbProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);

        if (!res.ok) {
          throw new Error("Failed to fetch products from the server");
        }
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          const mapped = json.data.map((p) => ({
            _id: p._id,
            name: p.name,
            image: p.images?.[0] || "",
            category: p.category,
            price: p.price,
            description: p.description,
            shortDesc: p.shortDesc || "",
            reviews: p.reviews || [],
            avgRating: p.avgRating || 0,
          }));
          setDbProducts(mapped);
          setProductData(mapped);
        } else {
        }
      } catch (err) {
        console.error("Failed to load products, using static fallback:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

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
    setCurrentPage(1);
  }, [categoryFilter, sortOrder, searchTerm, dbProducts]);

 

  const itemsPerPage = 12;
  const totalPages = Math.ceil(productData.length / itemsPerPage);
  const paginatedProducts = productData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <Productlist data={paginatedProducts} />
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 pt-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
                  <div>
                    Showing <span className="font-extrabold text-slate-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {Math.min(currentPage * itemsPerPage, productData.length)}
                    </span>{" "}
                    of <span className="font-extrabold text-slate-900 dark:text-white">{productData.length}</span> results
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`h-10 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          currentPage === page
                            ? "bg-purple-600 text-white shadow-md shadow-purple-650/20"
                            : "border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
