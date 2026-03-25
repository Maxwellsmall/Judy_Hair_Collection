import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.jpg";
import { Link } from "react-router-dom";
import { generateWhatsAppLink, WhatsAppMessages } from "../lib/whatsapp";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const whatsappLink = generateWhatsAppLink(
    "2347068383089",
    WhatsAppMessages.generalGreeting
  );

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/hairstyles" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="w-full bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={logo}
                alt="Judy Hair Collection Logo"
                className="w-10 h-10 rounded-full object-cover border-2 border-neutral-200"
              />
              <div>
                <h1 className="text-lg sm:text-xl font-bold font-heading text-neutral-900">
                  Judy Hair Collection
                </h1>
                <p className="text-xs text-neutral-500 font-body hidden sm:block">
                  Premium Hair Products
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="font-body text-sm font-medium text-neutral-700 hover:text-amber-700 transition-colors duration-150"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden md:block">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 font-semibold text-white text-sm transition-colors hover:bg-neutral-800"
              >
                Order on WhatsApp
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-neutral-700 hover:text-neutral-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation Drawer */}
          {isMobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-50">
              {/* Overlay */}
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Drawer */}
              <div className="absolute right-0 top-0 h-full w-full max-w-xs bg-white shadow-xl animate-slide-in">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-bold font-heading text-neutral-900">
                      Menu
                    </h2>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 text-neutral-700 hover:text-neutral-900"
                      aria-label="Close menu"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <nav className="flex flex-col space-y-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        to={link.href}
                        className="text-base font-medium text-neutral-700 hover:text-amber-700 hover:bg-neutral-50 py-3 px-4 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-8 pt-8 border-t border-neutral-200">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full gap-2 rounded-lg bg-whatsapp-green px-6 py-3 font-semibold text-white transition-colors hover:bg-whatsapp-green/90"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Order on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
