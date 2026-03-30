"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/whatsapp";

interface ProductInfoProps {
  product: {
    name: string;
    price: number;
    originalPrice?: number;
    description: string;
    sizes: string[];
    colors?: string[];
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { name, price, originalPrice, description, sizes, colors } = product;
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const formattedPrice = `₦${price.toLocaleString("en-NG")}`;
  const formattedOriginal = originalPrice
    ? `₦${originalPrice.toLocaleString("en-NG")}`
    : null;
  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  const whatsappMessage = selectedSize
    ? `Hi, I'm interested in ${name} - Size: ${selectedSize}`
    : `Hi, I'm interested in ${name}`;
  const whatsappHref = generateWhatsAppLink("393519420168", whatsappMessage);

  return (
    <div className="flex flex-col gap-6">
      {/* Name */}
      <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl font-heading">{name}</h1>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-neutral-900 font-body">{formattedPrice}</span>
        {formattedOriginal && (
          <span className="text-lg text-neutral-400 line-through font-body">{formattedOriginal}</span>
        )}
        {discount && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-sm font-semibold text-amber-700 font-body">
            -{discount}%
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-base leading-relaxed text-neutral-600 font-body">{description}</p>
      )}

      {/* Sizes */}
      {sizes.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-neutral-700 font-body">
            Size{selectedSize ? `: ${selectedSize}` : ""}
          </span>
          <div className="flex flex-wrap gap-2 font-body">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedSize === size
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {colors && colors.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-neutral-700 font-body">
            Color{selectedColor ? `: ${selectedColor}` : ""}
          </span>
          <div className="flex flex-wrap gap-2 font-body">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color === selectedColor ? null : color)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedColor === color
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-neutral-800 font-body"
      >
        <MessageCircle className="h-5 w-5" />
        Contact to Purchase
      </a>
    </div>
  );
}
