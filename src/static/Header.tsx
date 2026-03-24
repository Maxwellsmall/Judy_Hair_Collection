import { useState } from "react";
import { Heart, LucideShoppingCart } from "lucide-react";
import logo from "../assets/logo.jpg";
import { Link } from "react-router-dom";

const Header = () => {
  const [cartCount, setCartCount] = useState(2);
  const [wishCount, setWishCount] = useState(3);

  return (
    <>
      <header className="w-full bg-black text-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex justify-center items-center">
            <img
              src={logo}
              alt="Logo"
              className="w-[50px] h-[50px] rounded-full mx-3"
            />
            <h1 className="text-xl font-bold">Judy Hair Collection</h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-gray-600">
              Home
            </Link>
            <Link to="/hairstyles" className="hover:text-gray-600">
              Hairstyles
            </Link>
            <Link to="/about" className="hover:text-gray-600">
              About
            </Link>
            <Link to="/category" className="hover:text-gray-600">
              Category
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative cursor-pointer">
            
             <Link to="/wishlist">
              <Heart size={24} />
             </Link>

              {wishCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {wishCount}
                </span>
              )}
            </div>
            <div className="relative cursor-pointer">
              <LucideShoppingCart size={24} />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>

            <a
              href="https://wa.me/2347068383089"
              target="_blank"
              className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg text-sm"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
