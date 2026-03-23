
const FeaturedProducts = () => {
  const products = [
    { name: "Bone Straight Wig", price: "₦50,000", image: "/logo" },
    { name: "Deep Wave Wig", price: "₦45,000", image: "/logo" },
    { name: "Curly Wig", price: "₦40,000", image: "" },
  ];

  return (
    <section className="py-16 bg-gray-50 ">
      <h2 className="text-2xl font-semibold text-center mb-10">
        Featured Hairstyles
      </h2>

      <div className="grid md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto">
        {products.map((item, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-4">
            <img src={item.image} alt="" className="rounded-lg mb-4" />

            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-gray-500">{item.price}</p>

            <a
              href="https://wa.me/234XXXXXXXXXX"
              className="block mt-3 bg-black text-white text-center py-2 rounded-lg"
            >
              Order on WhatsApp
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
