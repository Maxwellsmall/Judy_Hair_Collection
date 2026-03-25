import ProductCard from "./ProductCard";
import type { ProductCardProps, ProductCategory } from "./ProductCard";
import { WhatsAppMessages } from "../lib/whatsapp";

// Sample product data - replace with actual product images and names
import hair1 from "../assets/hair1.jpg";
import hair2 from "../assets/hair2.jpg";
import hair3 from "../assets/hair3.jpg";
import hair4 from "../assets/hair4.jpg";
import hair5 from "../assets/hair5.jpg";
import hair6 from "../assets/hair6.jpg";

const productsData: ProductCardProps[] = [
  {
    id: "1",
    image: hair2,
    category: "Custom Wigs",
    productName: "Bone Straight Wig",
    whatsappMessage: WhatsAppMessages.productInquiry("Bone Straight Wig"),
    priceLabel: "Inquire for Price",
  },
  {
    id: "2",
    image: hair3,
    category: "Custom Wigs",
    productName: "Curly Wig",
    whatsappMessage: WhatsAppMessages.productInquiry("Curly Wig"),
    priceLabel: "Inquire for Price",
  },
  {
    id: "3",
    image: hair4,
    category: "Bundles",
    productName: "Vietnam Hair Bundle",
    whatsappMessage: WhatsAppMessages.productInquiry("Vietnam Hair Bundle"),
    priceLabel: "Inquire for Price",
  },
  {
    id: "4",
    image: hair5,
    category: "Bundles",
    productName: "Premium Hair Bundle",
    whatsappMessage: WhatsAppMessages.productInquiry("Premium Hair Bundle"),
    priceLabel: "Inquire for Price",
  },
  {
    id: "5",
    image: hair6,
    category: "Custom Wigs",
    productName: "Body Wave Wig",
    whatsappMessage: WhatsAppMessages.productInquiry("Body Wave Wig"),
    priceLabel: "Inquire for Price",
  },
  {
    id: "6",
    image: hair1,
    category: "Hair Care",
    productName: "Hair Care Kit",
    whatsappMessage: WhatsAppMessages.productInquiry("Hair Care Kit"),
    priceLabel: "Inquire for Price",
  },
];

interface ProductGalleryProps {
  title?: string;
  subtitle?: string;
  products?: ProductCardProps[];
  categoryFilter?: ProductCategory;
}

/**
 * ProductGallery Component
 * 
 * Displays a grid of products in the catalog.
 * Optionally filter by category.
 */
const ProductGallery = ({
  title = "Featured Collection",
  subtitle = "Explore our premium selection of wigs, bundles, and hair care products",
  products = productsData,
  categoryFilter,
}: ProductGalleryProps) => {
  const filteredProducts = categoryFilter
    ? products.filter((p) => p.category === categoryFilter)
    : products;

  return (
    <section id="products" className="py-16 sm:py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-heading mb-3">
            {title}
          </h2>
          <p className="text-lg text-neutral-600 font-body max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-500 font-body">
            No products found in this category.
          </p>
        )}
      </div>
    </section>
  );
};

export default ProductGallery;
