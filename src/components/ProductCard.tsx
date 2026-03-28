import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { generateWhatsAppLink } from "../lib/whatsapp";

export type ProductCategory = string;

export interface ProductCardProps {
  id: string;
  image: string;
  category: ProductCategory;
  productName: string;
  whatsappMessage: string;
  phoneNumber?: string;
  priceLabel?: string;
}

/**
 * ProductCard Component
 * 
 * Displays a product in the catalog.
 * Follows the BridAfriPride design spec with square image, clean typography.
 */
const ProductCard = ({
  id,
  image,
  category,
  productName,
  whatsappMessage,
  phoneNumber = "393519420168",
  priceLabel = "Inquire for Price",
}: ProductCardProps) => {
  const whatsappLink = generateWhatsAppLink(phoneNumber, whatsappMessage);

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
      role="article"
      aria-labelledby={`product-title-${id}`}
    >
      {/* Image Section — links to product detail page */}
      <Link href={`/products/${id}`} className="block">
        <div className="relative aspect-square bg-neutral-100 overflow-hidden">
          <img
            src={image}
            alt={productName}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {/* Category Badge */}
          <span className="absolute top-3 left-3 inline-flex items-center rounded-md bg-neutral-900/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {category}
          </span>
        </div>
      </Link>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${id}`}>
          <h3
            id={`product-title-${id}`}
            className="font-semibold text-neutral-900 font-heading line-clamp-2 hover:text-amber-700 transition-colors"
          >
            {productName}
          </h3>
        </Link>

        <p className="mt-2 text-sm font-bold text-amber-700 font-body">
          {priceLabel}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/products/${id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            View
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 cursor-pointer"
          >
            Inquire
          </a>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
