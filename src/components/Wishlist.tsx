import { useWishlist } from "../Context/WishlistContext";
import { Trash2 } from "lucide-react";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <section className="py-16 px-6 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-10">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500">No items in wishlist</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white shadow rounded-xl">
              <img
                src={item.image}
                className="w-full h-64 object-cover rounded-t-xl"
              />

              <div className="p-4">
                <h3>{item.name}</h3>
                <p className="text-[#D4AF37] font-bold">{item.price}</p>

                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="mt-3 flex items-center gap-2 text-red-500 cursor-pointer"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
