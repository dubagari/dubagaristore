import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/slice/cartThunks";

const ProductCart = ({ item }) => {
  const dispatch = useDispatch();

  
const addItem = () => {
  dispatch(
    addToCart({
      id: item._id,
    })
  );
};



  // Resolve the image URL
  const imgSrc =
    item.imgUrl || item.image
      ? (() => {
          const raw = item.imgUrl || item.image;
          if (!raw) return "https://placehold.co/400x300?text=No+Image";
          if (raw.startsWith("http")) return raw;
          return `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${
            raw.startsWith("/") ? "" : "/"
          }${raw}`;
        })()
      : "https://placehold.co/400x300?text=No+Image";

  const productId = item.id || item._id;
  const productName = item.productName || item.name || "Unknown Product";
  const category = item.category || "";
  const price = item.price || 0;

  return (
    <div className="flex flex-col justify-between w-full max-w-[280px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {/* Product Image */}
      <div className="w-full h-48 bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center p-4">
        <img
          src={imgSrc}
          alt={productName}
          className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Info */}
      <div className="mt-4 space-y-1.5">
        <span className="inline-block text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
          {category}
        </span>

        <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {productName}
        </h3>
      </div>

      {/* Pricing and CTAs */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
        <div>
          <span className="block text-[10px] font-semibold text-slate-400">
            Price
          </span>
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            ${Number(price).toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/shop/${productId}`}
            className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline px-2 py-1"
          >
            Details
          </Link>

          <button
            onClick={addItem}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white hover:bg-purple-700 active:scale-95 shadow-md shadow-purple-650/20 hover:shadow-lg transition-all"
            title="Add to Cart"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCart;
