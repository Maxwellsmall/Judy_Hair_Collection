import { ArrowRight } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/whatsapp";

export interface CategoryCardProps {
  name: string;
  slug?: string;
  image?: string;
  description?: string;
  phoneNumber?: string;
}

/**
 * CategoryCard Component
 * 
 * Displays a category with image overlay and CTA.
 * Follows the BridAfriPride design spec.
 */
const CategoryCard = ({
  name,
  image,
  description,
  phoneNumber = "2347068383089",
}: CategoryCardProps) => {
  const whatsappLink = generateWhatsAppLink(
    phoneNumber,
    `Hello, I'm interested in ${name} products.`
  );

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-xl bg-neutral-200"
    >
      <div className="relative aspect-[4/3] sm:aspect-[2/1]">
        {image ? (
          <>
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/30" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-300 to-neutral-400" />
        )}

        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3 className="text-2xl font-bold text-white font-heading">
            {name}
          </h3>

          {description && (
            <p className="mt-2 text-sm text-neutral-200 font-body">
              {description}
            </p>
          )}

          <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white w-fit transition-transform group-hover:translate-x-1">
            Shop {name}
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </a>
  );
};

export default CategoryCard;
