"use client";

import Link from "next/link";
import { generateWhatsAppLink, WhatsAppMessages } from "../../src/lib/whatsapp";
import { Instagram, Music2, MessageCircle } from "lucide-react";

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
    { 
      name: "Instagram", 
      href: "https://www.instagram.com/judy_haircollection?igsh=MzFhaGpoZXpqYzY0", 
      icon: <Instagram className="w-5 h-5" /> 
    },
    { 
      name: "TikTok", 
      href: "https://tiktok.com/@judy.hair.collect", 
      icon: <Music2 className="w-5 h-5" /> 
    },
    { 
      name: "WhatsApp", 
      href: whatsappLink, 
      icon: <MessageCircle className="w-5 h-5" /> 
    },
  ];

  return (
    <footer className="bg-neutral-900 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-heading tracking-tight">
                Judy Hair Collection
              </h2>
            </Link>
            <p className="text-neutral-400 font-body leading-relaxed max-w-xs">
              Exceptional quality for the modern woman. Experience the pinnacle of hair luxury and confidence.
            </p>
            <div className="pt-2">
               <p className="text-neutral-500 font-body text-xs uppercase tracking-[0.2em]">
                Premium Quality Wigs & Bundles
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-heading text-lg tracking-wide border-b border-white/10 pb-2 inline-block">
              Navigation
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 font-body hover:text-primary transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h3 className="font-heading text-lg tracking-wide border-b border-white/10 pb-2 inline-block">
              Assistance
            </h3>
            <ul className="space-y-4">
              {customerService.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 font-body hover:text-primary transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-6">
            <h3 className="font-heading text-lg tracking-wide border-b border-white/10 pb-2 inline-block">
              Connect
            </h3>
            <ul className="space-y-4">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 font-body hover:text-primary transition-colors duration-300 flex items-center gap-3 text-sm group"
                  >
                    <span className="group-hover:scale-110 transition-transform duration-300">{link.icon}</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="flex flex-col gap-1">
                <span className="text-neutral-500 font-body text-[10px] uppercase tracking-widest">Global Headquarters</span>
                <p className="text-neutral-300 font-body text-sm">
                  Genova, Italy
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-20 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-neutral-500 font-body text-[11px] uppercase tracking-widest">
            <p>&copy; {currentYear} Judy Hair Collection. Handcrafted Excellence.</p>
            <div className="flex gap-8">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
