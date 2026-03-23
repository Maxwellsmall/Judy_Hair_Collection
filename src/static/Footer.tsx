import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="bg-black text-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold mb-3">Judy Hair Collection</h2>
            <p className="text-sm text-gray-400">
              Premium hair for confident and stylish women. Quality you can
              trust.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/hairstyles" className="hover:text-white">
                  Hairstyles
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold mb-3">Help</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Delivery Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Return Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3">Contact</h3>
            <p className="text-sm text-gray-400">
              📱 WhatsApp: +234 XXX XXX XXXX
            </p>
            <p className="text-sm text-gray-400 mt-2">
              📸 Instagram: @judyhair
            </p>
            <p className="text-sm text-gray-400 mt-2">📍 Lagos, Nigeria</p>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/234XXXXXXXXXX"
              target="_blank"
              className="inline-block mt-4 bg-white text-black px-4 py-2 rounded-lg text-sm"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 text-center text-sm text-gray-500 py-4">
          © {new Date().getFullYear()} Judy Hair Collection. All rights
          reserved.
        </div>
      </footer>
    </>
  );
};

export default Footer;
