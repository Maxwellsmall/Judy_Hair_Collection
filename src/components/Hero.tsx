
const Hero = () => {
  return (
    <>
       <section className="w-full bg-[#fdf8f5] py-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        {/* Left */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Slay Every Look with{" "}
            <span className="text-pink-500">Premium Hair</span>
          </h1>

          <p className="mt-4 text-gray-600">
            Discover high-quality wigs and hairstyles that give you confidence,
            beauty, and elegance every day.
          </p>

          <div className="mt-6 flex gap-4">
            <a
              href="/hairstyles"
              className="bg-black text-white px-6 py-3 rounded-lg"
            >
              Browse Styles
            </a>

            <a
              href="https://wa.me/2347068383089"
              target="_blank"
              className="border px-6 py-3 rounded-lg"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>

        {/* Right */}
        <div>
          <img
            src="/hero-hair.jpg"
            alt="Hair"
            className="rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </section>
    </>
)
}

export default Hero