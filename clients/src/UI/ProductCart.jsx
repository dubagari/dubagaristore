import { Link } from "react-router-dom";
import { Plus, Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slice/cartThunks";
import { addToWishlist, removeFromWishlist } from "../store/slice/wishlistThunks";
import { selectWishlistItems } from "../store/slice/wishlistSlice";

const ProductCart = ({ item }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const productId = item.id || item._id;

  const isInWishlist = wishlistItems?.some((w) => w.product === productId);

  const toggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(productId));
    } else {
      dispatch(addToWishlist(productId));
    }
  };
  
const addItem = () => {
  dispatch(
    addToCart({
      id: productId,
    })
  );
};

const BASE_URL = import.meta.env.VITE_API_URL;


  // Resolve the image URL
  const imgSrc =
    item.imgUrl || item.image
      ? (() => {
          const raw = item.imgUrl || item.image;
          if (!raw) return "https://placehold.co/400x300?text=No+Image";
          if (raw.startsWith("http")) return raw;
          return `${BASE_URL}${
            raw.startsWith("/") ? "" : "/"
          }${raw}`;
        })()
      : "https://placehold.co/400x300?text=No+Image";

  const productName = item.productName || item.name || "Unknown Product";
  const category = item.category || "";
  const price = item.price || 0;

  return (
    <div className="group flex w-full max-w-[280px] flex-col justify-between rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-4">
      {/* Product Image */}
      <div className="flex h-40 items-center justify-center overflow-hidden rounded-[1.25rem] bg-slate-50 p-3 dark:bg-slate-950 sm:h-44">
        <img
          src={imgSrc}
          alt={productName}
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1.5">
        <span className="inline-block text-[10px] font-extrabold uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">
          {category}
        </span>

        <h3 className="line-clamp-2 text-sm font-semibold text-slate-800 transition-colors group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">
          {productName}
        </h3>
      </div>

      {/* Pricing and CTAs */}
      <div className="mt-3 flex items-end justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <div className="min-w-0">
          <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Price
          </span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            ${Number(price).toFixed(2)}
          </span>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Link
            to={`/shop/${productId}`}
            className="px-2 py-1 text-[10px] font-semibold text-purple-600 transition-all hover:underline dark:text-purple-400"
          >
            Details
          </Link>

          <button
            onClick={toggleWishlist}
            className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all ${
              isInWishlist
                ? "border-red-200 bg-red-50 text-red-500 dark:border-red-900/50 dark:bg-red-900/20"
                : "border-slate-200 bg-white text-slate-400 hover:bg-red-50 hover:text-red-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-red-900/20"
            }`}
            title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={addItem}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm transition-all hover:bg-purple-700 hover:shadow-md active:scale-95"
            title="Add to Cart"
          >
            <Plus className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCart;
