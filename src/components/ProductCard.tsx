import { ArrowRight } from "lucide-react";
import { generateWhatsAppLink } from "../lib/whatsapp";

export type ProductCategory = "Bundles" | "Custom Wigs" | "Hair Care";

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
  phoneNumber = "2347068383089",
  priceLabel = "Inquire for Price",
}: ProductCardProps) => {
  const whatsappLink = generateWhatsAppLink(phoneNumber, whatsappMessage);

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
      role="article"
      aria-labelledby={`product-title-${id}`}
    >
      {/* Image Section */}
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

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        <h3
          id={`product-title-${id}`}
          className="font-semibold text-neutral-900 font-heading line-clamp-2"
        >
          {productName}
        </h3>

        <p className="mt-2 text-sm font-bold text-amber-700 font-body">
          {priceLabel}
        </p>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 w-fit"
        >
          Inquire
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
};

export default ProductCard;
