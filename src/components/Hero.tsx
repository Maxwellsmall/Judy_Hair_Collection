
import Hair3 from "../assets/hair3.jpg"


const Hero = () => {
  return (
    <>
       <section className="bg-black py-20">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
                      Luxury Hair That Defines Your{" "}
                      <span className="text-[#D4AF37]">Beauty</span> 
                    </h1>
      
                    <p className="mt-4 text-white">
                      Discover premium wigs and hairstyles designed to give you
                      confidence and elegance.
                    </p>
      
                    <div className="mt-6 flex gap-4">
                      <a
                        href="/hairstyles"
                        className="bg-white text-black px-6 py-3 rounded-lg"
                      >
                        Browse Styles
                      </a>
      
                      <a
                        href="https://wa.me/234XXXXXXXXXX"
                        target="_blank"
                        className="border px-6 py-3 rounded-lg text-white"
                      >
                        Order on WhatsApp
                      </a>
                    </div>
                  </div>
      
                  <div>
                    <img
                      src={Hair3}
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