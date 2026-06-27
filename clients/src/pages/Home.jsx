import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import image from "../assets/images/phone-bg-02.jpg";
import Service from "../service/Service";
import ProductList from "../UI/Productlist";
import products from "../assets/data/products";
import Clock from "../UI/Clock";
import imag from "../assets/images/phne.jpg";

const Home = () => {
  const year = new Date().getFullYear();

  const [hpData, setHpData] = useState([]);
  const [watchData, setWatchData] = useState([]);
  const [latestData, setLatestData] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL }/api/products?limit=100`);
        const json = await res.json();
        console.log(json);

       if (json.success && json.data) {
  const dbProducts = json.data.map((p) => ({
    id: p._id,
    productName: p.name,
    imgUrl: p.images?.[0] || p.image || "",
    category: p.category,
    price: p.price,
    shortDesc: p.shortDesc || "No short description.",
    description: p.description || "No full description.",
    reviews: p.reviews || [],
    avgRating: p.avgRating || 0,
    isNewArrival: p.isNewArrival || false,
  }));
console.log("Fetched:", dbProducts.length);
console.log(dbProducts.map(p => ({
  name: p.productName,
  category: p.category
})));

  const hpProducts = dbProducts.filter(
  (item) => item.category === "hp" || item.category === "apple"
);

const watchProducts = dbProducts.filter(
  (item) =>
    item.category === "watch" ||
    item.category === "smartwatch"
);

const latestProducts = dbProducts.filter(
  (item) => item.isNewArrival
);

         console.log("HP", hpProducts);
console.log("Watch", watchProducts);
console.log("Latest", latestProducts);
setHpData(hpProducts.slice(0, 4));
         setWatchData(watchProducts.slice(0, 4));
         setLatestData(latestProducts.slice(0, 4));


}
      } catch (err) {
        console.error("Failed to load products, using fallback:", err);
        const dbProducts = products.map((p) => ({
          id: p.id,
          productName: p.productName,
          imgUrl: p.imgUrl || "",
          category: p.category,
          price: p.price,
          shortDesc: p.shortDesc || "No short description.",
          description: p.description || "No full description.",
          reviews: p.reviews || [],
          avgRating: p.avgRating || 0,
          isNewArrival: p.isNewArrival || false,
        }));

        const hpProducts = dbProducts.filter(
          (item) => item.category === "hp" || item.category === "apple"
        );
        const watchProducts = dbProducts.filter(
          (item) => item.category === "watch" || item.category === "smartwatch"
        );
        const latestProducts = dbProducts.filter(
          (item) => item.isNewArrival
        );

        setHpData(hpProducts.slice(0, 4));
        setWatchData(watchProducts.slice(0, 4));
        setLatestData(latestProducts.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

   
    loadProducts();
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-20 lg:py-32 overflow-hidden text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500 via-slate-900 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-purple-400 bg-purple-950/60 px-4 py-1.5 rounded-full border border-purple-800/50">
              New Arrivals of {year}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight">
              Welcome to <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Dubagari Store
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              Explore our premium collection of performance-optimized HP laptops, high-definition smart wearables, and sound-engineered acoustics. Designed to elevate your daily digital lifestyle.
            </p>
            <div className="pt-4">
              <Link to="/shop">
                <button className="px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-purple-650/30 transition-all duration-300 hover:-translate-y-0.5">
                  Buy Now
                </button>
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative group max-w-md w-full">
              <div className="absolute inset-0 bg-purple-600/20 blur-3xl group-hover:bg-purple-600/30 transition-all rounded-full pointer-events-none"></div>
              <img
                src={image}
                alt="Featured Smartphone Banner"
                className="rounded-[3rem] shadow-2xl relative z-10 w-full object-cover max-h-[450px] border border-slate-700 group-hover:scale-[1.01] transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Service />
        </div>
      </section>

      {/* HP Laptops Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight uppercase text-slate-900 dark:text-white">
              Laptops & <span className="text-purple-600 dark:text-purple-400">Computers</span>
            </h2>
            <div className="h-1 w-12 bg-purple-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-4 gap-4">
   {loading ? (
  <p>Loading products...</p>
) : hpData.length > 0 ? (
  <ProductList data={hpData} />
) : (
  <p className=" self-center font-bold text-slate-400 animate-pulse py-10">
    No products available.
  </p>
)}
</div>
        </div>
      </section>

      {/* Watches Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-b border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight uppercase text-slate-900 dark:text-white">
              Smart <span className="text-purple-600 dark:text-purple-400">Watches</span>
            </h2>
            <div className="h-1 w-12 bg-purple-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-4 gap-4">
        {loading ? (
  <p>Loading products...</p>
) : watchData.length > 0 ? (
  <ProductList data={watchData} />
) : (
  <p className="text-center font-bold text-slate-400 animate-pulse py-10">
    No products available.
  </p>
)}
          </div>
        </div>
      </section>

      {/* Special Offer / Countdown Section */}
      <section className="bg-slate-900 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Clock />

          <div className="flex justify-center lg:justify-end">
            <img
              src={imag}
              alt="Promo Product Watch/Phone"
              className="max-h-[300px] w-auto object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight uppercase text-slate-900 dark:text-white">
              Latest <span className="text-purple-600 dark:text-purple-400">Arrivals</span>
            </h2>
            <div className="h-1 w-12 bg-purple-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-4 gap-4">
           {loading ? (
  <p>Loading products...</p>
) : latestData.length > 0 ? (
  <ProductList data={latestData} />
) : (
   <p className="text-center font-bold text-slate-400 animate-pulse py-10">
    No products available.
  </p>
)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
