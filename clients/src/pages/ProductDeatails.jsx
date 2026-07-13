import { useEffect, useState } from "react";
import Shopcommon from "../UI/Shopcommon";
import { useParams } from "react-router-dom";
import products from "../assets/data/products";
import Productlist from "../UI/Productlist";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slice/cartThunks";
import { addToWishlist, removeFromWishlist } from "../store/slice/wishlistThunks";
import { selectWishlistItems } from "../store/slice/wishlistSlice";
import { toast } from "react-toastify";
import { Heart } from "lucide-react";

const ProductDeatails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("decs");
  const [str, setStr] = useState(5);
  const [formdata, setData] = useState({
    enterName: "",
    massage: "",
  });

  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const productId = product?.id;
  const isInWishlist = wishlistItems?.some((w) => w.product === productId);

  const toggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(productId));
    } else {
      dispatch(addToWishlist(productId));
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          const mapped = json.data.map((p) => ({
            id: p._id,
            productName: p.name,
            imgUrl: p.images?.[0] || p.image || "",
            category: p.category || "hp",
            price: p.price,
            shortDesc: p.shortDesc || "No short description.",
            description: p.description || "No full description.",
            reviews: p.reviews || [],
            avgRating: p.avgRating || 4.5,
          }));
          setAllProducts(mapped);
          const found = mapped.find((item) => item.id === id);
          if (found) {
            setProduct(found);
          } else {
            useFallback();
          }
        } else {
          useFallback();
        }
      } catch (err) {
        console.error("Error loading products, using fallback:", err);
        useFallback();
      } finally {
        setLoading(false);
      }
    };

    const useFallback = () => {
      setAllProducts(products);
      const found = products.find((item) => item.id === id);
      setProduct(found);
    };

    loadProducts();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 250);
  }, [product]);

  const onchange = (e) => {
    const { name, value } = e.target;
    setData({ ...formdata, [name]: value });
  };

  const { enterName, massage } = formdata;

  const onsubmit = (e) => {
    e.preventDefault();
    if (!enterName || !massage) return;

    const objectData = {
      name: enterName,
      masg: massage,
      rating: str,
    };

    // Add review locally in UI
    if (product) {
      const updatedReviews = [
        ...product.reviews,
        { rating: str, text: massage },
      ];
      setProduct({ ...product, reviews: updatedReviews });
    }

    setData({ enterName: "", massage: "" });
    toast.success("Review Submitted Successfully!");
  };

 const addItem = () => {
   dispatch(
     addToCart({
       id: productId,
     })
   );
 };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-sm font-semibold text-slate-400 animate-pulse">
          Loading product details...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 space-y-4">
        <h3 className="text-lg font-bold text-slate-500">Product not found</h3>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
        >
          Go Back
        </button>
      </div>
    );
  }

  const {
    productName,
    imgUrl,
    category,
    price,
    shortDesc,
    description,
    reviews,
    avgRating,
  } = product;
  const relatedProduct = allProducts.filter(
    (item) => item.category === category && item.id !== id,
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen pb-20 transition-colors duration-200">
      <Shopcommon title={productName} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Main Details Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Product Image Box */}
          <div className="h-96 md:h-[450px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] flex items-center justify-center p-8 shadow-sm">
            <img
              src={imgUrl}
              alt={productName}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Right: Product Details Information */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-purple-650 dark:text-purple-400">
                {category.toUpperCase()}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {productName}
              </h2>
            </div>

            {/* Ratings row */}
            <div className="flex items-center gap-3">
              <div className="flex text-amber-500 text-sm gap-0.5">
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-fill"></i>
                <i className="ri-star-half-line"></i>
              </div>
              <span className="text-xs font-bold text-slate-400">
                ({avgRating} Rating)
              </span>
            </div>

            {/* Price tag */}
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              ${parseFloat(price).toFixed(2)}
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              {shortDesc}
            </p>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
              <button
                onClick={addItem}
                className="px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-purple-650/30 transition-all"
              >
                Add to Cart
              </button>
              <button
                onClick={toggleWishlist}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all ${
                  isInWishlist
                    ? "bg-red-50 text-red-500 border-red-200 dark:bg-red-900/20 dark:border-red-900/50"
                    : "bg-transparent text-slate-400 border-slate-200 dark:border-slate-800 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                }`}
                title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Block (Description vs Reviews) */}
        <div className="space-y-8">
          <div className="flex border-b border-slate-200 dark:border-slate-800 font-bold text-sm">
            <button
              onClick={() => setTab("decs")}
              className={`pb-4 px-6 relative transition-colors ${
                tab === "decs"
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Description
              {tab === "decs" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600"></span>
              )}
            </button>
            <button
              onClick={() => setTab("rev")}
              className={`pb-4 px-6 relative transition-colors ${
                tab === "rev"
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Reviews ({reviews.length})
              {tab === "rev" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600"></span>
              )}
            </button>
          </div>

          {/* Tab Content Panels */}
          {tab === "decs" ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                {description}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Reviews History */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 max-h-[400px] overflow-y-auto">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-3">
                  Customer Comments
                </h4>
                {reviews.length === 0 ? (
                  <p className="text-xs font-semibold text-slate-400">
                    No reviews yet. Be the first to leave one!
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {reviews.map((item, index) => (
                      <li
                        key={index}
                        className="space-y-2 border-b border-slate-50 dark:border-slate-850 pb-3 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-amber-500 rounded-md px-1.5 py-0.5">
                            {item.rating}{" "}
                            <i className="ri-star-s-fill text-[9px]"></i>
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-350 italic">
                          "{item.text}"
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Leave Comment Form */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                <h4 className="text-sm font-bold text-slate-800 dark:text-white pb-1">
                  Leave your comment
                </h4>

                <form
                  onSubmit={onsubmit}
                  className="space-y-4 font-semibold text-xs"
                >
                  <div className="space-y-1.5">
                    <label className="text-slate-400">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Abubakar Dubagari"
                      name="enterName"
                      onChange={onchange}
                      value={enterName}
                      required
                      className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:bg-white focus:border-purple-500 dark:text-slate-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400">Rating Score</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((starNum) => (
                        <button
                          key={starNum}
                          type="button"
                          onClick={() => setStr(starNum)}
                          className={`flex items-center gap-0.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
                            str === starNum
                              ? "bg-amber-50 border-amber-300 text-amber-600 dark:bg-amber-950/40 dark:border-amber-800"
                              : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950"
                          }`}
                        >
                          {starNum} <i className="ri-star-s-fill"></i>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-400">Your Message</label>
                    <textarea
                      placeholder="Write your comment..."
                      value={massage}
                      name="massage"
                      onChange={onchange}
                      required
                      rows="4"
                      className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm outline-none focus:bg-white focus:border-purple-500 dark:text-slate-200"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProduct.length > 0 && (
          <div className="space-y-8 border-t border-slate-100 dark:border-slate-800 pt-16">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Related Products
            </h3>
            <div className="flex flex-wrap gap-6 justify-center">
              <Productlist data={relatedProduct.slice(0, 4)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDeatails;
