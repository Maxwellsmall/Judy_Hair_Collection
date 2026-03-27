import { Heart } from "lucide-react";
import { useContext } from "react";
import { CartContext } from "../Context/CartContext";
import { useWishlist } from "../Context/WishlistContext";

import hair1 from "../assets/hair1.jpg";
import hair2 from "../assets/hair2.jpg";
import hair3 from "../assets/hair3.jpg";
import hair4 from "../assets/hair4.jpg";
import hair5 from "../assets/hair5.jpg";
import hair6 from "../assets/hair6.jpg";

const HairStyles = [
  { id: 1, name: "Bone Straight Wig", price: "₦50,000", image: hair2 },
  { id: 2, name: "Curly Wig", price: "₦45,000", image: hair3 },
  { id: 3, name: "Curly Wig", price: "₦45,000", image: hair4 },
  { id: 4, name: "Curly Wig", price: "₦45,000", image: hair5 },
  { id: 5, name: "Curly Wig", price: "₦45,000", image: hair6 },
  { id: 6, name: "Bone Straight Wig", price: "₦50,000", image: hair1 },
];

const Products = () => {
  const { addToCart } = useContext(CartContext);

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // const inWishlist = isInWishlist(product.id);

  return (
    <section className="py-16 bg-gray-50">
      <h2 className="text-3xl font-semibold text-center mb-10">
        Featured Hairstyles
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {HairStyles.map((item) => {
          const inWishlist = isInWishlist(item.id);

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-4 group flex flex-col h-full"
            >
              <div className="relative overflow-hidden rounded-lg aspect-square mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute top-3 right-3 cursor-pointer">
                  <Heart
                    size={22}
                    onClick={() =>
                      inWishlist
                        ? removeFromWishlist(item.id)
                        : addToWishlist(item)
                    }
                    className={`transition ${
                      inWishlist ? "text-red-500 fill-red-500" : "text-white"
                    }`}
                  />
                </div>
              </div>

              <div className="flex flex-col flex-grow">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {item.price}
                </p>

                <div className="mt-auto pt-5 space-y-3">
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full border py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-150"
                  >
                    Add to Cart
                  </button>

                  <a
                    href="https://wa.me/234XXXXXXXXXX"
                    className="block bg-black text-white text-center py-2.5 rounded-lg hover:bg-gray-800 transition duration-150"
                  >
                    Order on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Products;
