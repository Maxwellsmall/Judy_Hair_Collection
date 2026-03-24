import React from 'react'

const ShopByStyle = () => {
  return (
    <>
      <section className="py-16">
        <h2 className="text-2xl font-semibold text-center mb-10">
          Shop by <span className="font-bold text-3xl">Style</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-6">
          {["Bone Straight", "Curly", "Frontal", "Braids"].map((item, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg cursor-pointer"
            >
              <p className="font-medium">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default ShopByStyle