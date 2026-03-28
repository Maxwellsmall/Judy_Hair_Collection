import dynamic from "next/dynamic";
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
      <section id="contact" className="py-20 px-6 bg-neutral-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold font-heading mb-6">Get in Touch</h2>
          <p className="text-lg text-neutral-600 font-body mb-8">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
          <a
            href="https://wa.me/393519420168"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-whatsapp-green px-8 py-4 font-semibold text-white transition-colors hover:bg-whatsapp-green/90 text-lg"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
