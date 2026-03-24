// import React, { useState } from "react";
// import { Heart } from "lucide-react";

// import hair1 from "../assets/hair1.jpg";
// import hair2 from "../assets/hair2.jpg";
// import hair3 from "../assets/hair3.jpg";
// import hair4 from "../assets/hair4.jpg";
// import hair5 from "../assets/hair5.jpg";
// import hair6 from "../assets/hair6.jpg";

// const HairStyles = [
//   {
//     name: "Bone Straight Wig",
//     price: "₦50,000",
//     image: hair2,
//   },
//   {
//     name: "Curly Wig",
//     price: "₦45,000",
//     image: hair3,
//   },

//   {
//     name: "Curly Wig",
//     price: "₦45,000",
//     image: hair4,
//   },
//   {
//     name: "Curly Wig",
//     price: "₦45,000",
//     image: hair5,
//   },
//   {
//     name: "Curly Wig",
//     price: "₦45,000",
//     image: hair6,
//   },
//   {
//     name: "Bone Straight Wig",
//     price: "₦50,000",
//     image: hair1,
//   },
// ];

// const Products = () => {
//   const [wishlist, setWishlist] = useState([]);

//   const toggleWishlist = (id) => {
//     if (wishlist.includes(id)) {
//       setWishlist(wishlist.filter((item) => item !== id));
//     } else {
//       setWishlist([...wishlist, id]);
//     }
//   };

//   return (
//     <section className="py-16 bg-gray-50">
//       <h2 className="text-3xl font-semibold text-center mb-10">
//         Featured Hairstyles
//       </h2>

//       <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
//         {HairStyles.map((item) => {
//           const isLiked = wishlist.includes(item);

//           return (
//             <div key={item} className="bg-white rounded-xl shadow-md p-4 group">
//               <div className="relative overflow-hidden rounded-lg">
//                 <img
//                   src={item.image}
//                   alt="Hair"
//                   className="rounded-lg mb-4 w-full transition-transform duration-300 group-hover:scale-105"
//                 />

//                 <button
//                   onClick={() => toggleWishlist(item)}
//                   className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300
//                   ${
//                     isLiked
//                       ? "bg-red-500 text-white scale-110"
//                       : "bg-white text-black opacity-0 group-hover:opacity-100"
//                   }`}
//                 >
//                   <Heart size={18} fill={isLiked ? "white" : "none"} />
//                 </button>
//               </div>

//               <h3 className="font-semibold">{item.name}</h3>
//               <p className="text-gray-500">{item.price}</p>

//               <button className="mt-3 w-full border py-2 rounded-lg cursor-pointer">
//                 Add to Cart
//               </button>

//               <a
//                 href="https://wa.me/234XXXXXXXXXX"
//                 className="block mt-2 bg-black text-white text-center py-2 rounded-lg"
//               >
//                 Order on WhatsApp
//               </a>
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// };

// export default Products;

import React, { useState } from "react";
import { Heart } from "lucide-react";

// Assuming these imports are correct based on your project structure
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
  // Use IDs for state tracking, it is much more efficient than entire objects
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter((item) => item !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <h2 className="text-3xl font-semibold text-center mb-10">
        Featured Hairstyles
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {HairStyles.map((item) => {
          // Check state using the item's unique ID
          const isLiked = wishlist.includes(item.id);

          return (
            // --- MODIFICATION 1: Use Unique ID for Key ---
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-4 group flex flex-col h-full"
            >
              {/* --- MODIFICATION 2: Consistent Aspect Ratio --- */}
              {/* We force a square container and use object-fit to center and cover the image */}
              <div className="relative overflow-hidden rounded-lg aspect-square mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <button
                  // --- MODIFICATION 3: Pass ID, not object ---
                  onClick={() => toggleWishlist(item.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 z-10 
                  ${
                    isLiked
                      ? "bg-red-500 text-white scale-110"
                      : "bg-white text-black opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <Heart size={18} fill={isLiked ? "white" : "none"} />
                </button>
              </div>

              {/* --- MODIFICATION 4: Bottom alignment of buttons --- */}
              {/* This section now uses Flexbox to push buttons to the absolute bottom of the card */}
              <div className="flex flex-col flex-grow">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {item.price}
                </p>

                {/* flex-grow pushes the action buttons section to the bottom */}
                <div className="mt-auto pt-5 space-y-3">
                  <button className="w-full border py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 transition duration-150">
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