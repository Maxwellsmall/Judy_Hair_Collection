import React from 'react'
import Hair5 from "../assets/hair5.jpg"



const Products = () => {
  return (
    <>
      <section className="py-16 bg-gray-50">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Featured Hairstyles
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="bg-white rounded-xl shadow-md p-4">
              <img src={Hair5} alt="Hair" className="rounded-lg mb-4" />

              <h3 className="font-semibold">Bone Straight Wig</h3>
              <p className="text-gray-500">₦50,000</p>

              <button className="mt-3 w-full border py-2 rounded-lg cursor-pointer">
                Add to Cart
              </button>

              <a
                href="https://wa.me/234XXXXXXXXXX"
                className="block mt-2 bg-black text-white text-center py-2 rounded-lg"
              >
                Order on WhatsApp
              </a>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Products