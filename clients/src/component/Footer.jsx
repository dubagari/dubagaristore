import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Column */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">
              dubagari
              <span className="text-purple-500">store</span>
            </h2>
            <p className="text-sm leading-relaxed text-slate-400">
              Welcome to Dubagari Store, your ultimate destination for high-quality computing electronics, trending phones, and premium accessories.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Atque odio ex.
            </p>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white tracking-wider">Contact Us</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <i className="ri-mail-line text-purple-400 text-lg"></i>
                <span>superango@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="ri-phone-line text-purple-400 text-lg"></i>
                <span>+324 7036112003</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="ri-map-pin-line text-purple-400 text-lg"></i>
                <span>Nigeria</span>
              </li>
              <li className="flex items-center gap-3">
                <i className="ri-links-line text-purple-400 text-lg"></i>
                <a href="https://superango.com" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors">
                  superango.com
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white tracking-wider">Useful Links</h2>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <Link to="/" className="hover:text-purple-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-purple-400 transition-colors duration-200">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-purple-400 transition-colors duration-200">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Column */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white tracking-wider">Available Categories</h2>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-purple-400 transition-colors cursor-pointer">Mobile</li>
              <li className="hover:text-purple-400 transition-colors cursor-pointer">Phones</li>
              <li className="hover:text-purple-400 transition-colors cursor-pointer">Headset</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright block */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>&copy; {currentYear} Dubagari Store. All rights reserved. Created with premium craftsmanship.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
