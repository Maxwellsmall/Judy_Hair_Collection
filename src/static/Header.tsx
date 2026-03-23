import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import logo from "../assets/logo.jpg";
import { Link } from "react-router-dom";

const Header = () => {
  const [cartCount, setCartCount] = useState(2); // dummy value

  return (
    <>
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex justify-center items-center">
            <img
              src={logo}
              alt="Logo"
              className="w-[50px] h-[50px] rounded-full mx-3"
            />
            <h1 className="text-xl font-bold">Judy Hair Collection</h1>
          </div>

          {/* Nav Links */}
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
            <Link to="/contact" className="hover:text-gray-600">
              Contact
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <div className="relative cursor-pointer">
              <ShoppingCart size={24} />

              {/* Cart Count Badge */}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/2347068383089"
              target="_blank"
              className="bg-black text-white px-4 py-2 rounded-lg text-sm"
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
