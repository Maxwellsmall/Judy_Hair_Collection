"use client";

import Link from "next/link";
import { generateWhatsAppLink, WhatsAppMessages } from "../../src/lib/whatsapp";
import { Instagram, Music2, MessageCircle, Facebook } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const whatsappLink = generateWhatsAppLink(
    "393519420168",
    WhatsAppMessages.generalGreeting
  );

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/hairstyles" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/#contact" },
  ];

  const customerService = [
    { name: "Shipping Info", href: "/#shipping" },
    { name: "Returns Policy", href: "/#returns" },
    { name: "FAQ", href: "/#faq" },
    { name: "Support", href: "/#support" },
  ];

  const socialLinks = [
    { name: "Instagram", href: "https://www.instagram.com/judy_haircollection?igsh=MzFhaGpoZXpqYzY0", icon: <Instagram className="w-5 h-5" /> },
    { name: "TikTok", href: "https://tiktok.com/@judy.hair.collect", icon: <Music2 className="w-5 h-5" /> },
    { name: "WhatsApp", href: whatsappLink, icon: <MessageCircle className="w-5 h-5" /> },
  ];

  return (
    <footer className="bg-neutral-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div>
            <h2 className="text-xl font-bold font-heading mb-4">
              Judy Hair Collection
            </h2>
            <p className="text-neutral-400 font-body leading-relaxed mb-6">
              Premium hair for confident and stylish women. Quality you can
              trust.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-whatsapp-green px-6 py-3 font-semibold text-white transition-colors hover:bg-whatsapp-green/90"
            >
              Chat on WhatsApp
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold font-heading text-base mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 font-body hover:text-white transition-colors duration-150"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold font-heading text-base mb-4">
              Customer Service
            </h3>
            <ul className="space-y-3">
              {customerService.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 font-body hover:text-white transition-colors duration-150"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold font-heading text-base mb-4">
              Connect
            </h3>
            <ul className="space-y-3">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-neutral-400 font-body hover:text-white transition-colors duration-150 flex items-center gap-2"
                  >
                    <span>{link.icon}</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-neutral-800">
              <p className="text-neutral-400 font-body text-sm">
                <span className="font-semibold text-white">Location:</span> Genova, Italy
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-500 font-body text-sm">
          <p>&copy; {currentYear} Judy Hair Collection. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
