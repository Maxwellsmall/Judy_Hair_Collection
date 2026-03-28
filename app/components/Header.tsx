"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../../src/assets/logo.jpg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateWhatsAppLink, WhatsAppMessages } from "../../src/lib/whatsapp";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const whatsappLink = generateWhatsAppLink(
    "393519420168",
    WhatsAppMessages.generalGreeting
  );

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/hairstyles" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <>
      <header className="w-full bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src={logo.src}
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
                  href={link.href}
                  className={`font-body text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-amber-700"
                      : "text-neutral-700 hover:text-amber-700"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-small"
              >
                Contact Us
              </a>
              <Link
                href="/admin"
                className="btn-small"
              >
                Admin
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-neutral-200 mt-4">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-body text-sm font-medium ${
                      pathname === link.href
                        ? "text-amber-700"
                        : "text-neutral-700 hover:text-amber-700"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-small"
                >
                  Contact Us
                </a>
                <Link
                  href="/admin"
                  className="btn-small"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
