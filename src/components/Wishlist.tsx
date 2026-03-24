import React from "react";
import hair2 from "../assets/hair2.jpg"
import hair3 from "../assets/hair3.jpg"
import hair4 from "../assets/hair4.jpg"

import { Trash2, ShoppingCart } from "lucide-react";

const wishlist = [
  {
    id: 1,
    name: "Bone Straight Wig",
    price: "₦50,000",
    image: hair2,
  },
  {
    id: 2,
    name: "Curly Wig",
    price: "₦45,000",
    image: hair3,
  },

  {
    id: 3,
    name: "Curly Wig",
    price: "₦45,000",
    image: hair4
  },
];

const Wishlist = () => {
  return (
    <section className="min-h-screen bg-[#f9f9f9] py-16 px-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-10">My Wishlist</h1>

      {/* Empty State */}
      {wishlist.length === 0 && (
        <div className="text-center mt-20">
          <p className="text-gray-500 text-lg">Your wishlist is empty</p>
        </div>
      )}

      {/* Wishlist Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
            {/* Image */}
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-64 object-cover"
            />

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-[#D4AF37] font-bold mt-1">{item.price}</p>

              {/* Buttons */}
              <div className="flex gap-2 mt-4">
                {/* Add to Cart */}
                <button className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg hover:bg-gray-800">
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>

                {/* Remove */}
                <button className="p-2 border rounded-lg hover:bg-gray-100">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      {wishlist.length > 0 && (
        <div className="text-center mt-12">
          <button className="bg-[#D4AF37] text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition">
            Add All to Cart
          </button>
        </div>
      )}
    </section>
  );
};

export default Wishlist;
