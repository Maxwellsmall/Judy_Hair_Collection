import CategoryCard from "./CategoryCard";

const categories = [
  { 
    name: "Bundles", 
    slug: "bundles",
    description: "Premium hair extensions",
  },
  { 
    name: "Custom Wigs", 
    slug: "custom-wigs",
    description: "Handcrafted wigs",
  },
  { 
    name: "Hair Care", 
    slug: "hair-care",
    description: "Essential products",
  },
];

const ShopByStyle = () => {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-heading mb-3">
            Shop by Category
          </h2>
          <p className="text-lg text-neutral-600 font-body max-w-2xl mx-auto">
            Explore our curated collections of premium hair products
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category) => (
            <CategoryCard
              key={category.slug}
              name={category.name}
              slug={category.slug}
              description={category.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByStyle;