import dynamic from "next/dynamic";
import Link from "next/link";
import Hero from "../../src/components/Hero";
import ProductGallery from "../../src/components/ProductGallery";
import ShopByCategory from "../../src/components/ShopByCategory";

const Testimonials = dynamic(() => import("../../src/components/Testimonials"), { ssr: false });

export default function HomePage() {
  return (
    <>
      <Hero />
      <ShopByCategory />
      <ProductGallery />
      <Testimonials />
      
      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-heading tracking-tight">Get in Touch</h2>
          <p className="text-xl text-neutral-600 font-body leading-relaxed max-w-2xl mx-auto">
            Have questions about our collection or need a consultation? We&apos;re here to help you find your perfect match.
          </p>
          <div className="flex flex-col items-center gap-4 pt-4">
            <Link 
              href="mailto:info@judyhaircollection.com" 
              className="text-neutral-900 font-body font-semibold tracking-widest uppercase text-sm border-b-2 border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-600 transition-all"
            >
              Email Us
            </Link>
            <p className="text-neutral-400 font-body text-sm mt-4">
              Or connect with us via our social channels below.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
