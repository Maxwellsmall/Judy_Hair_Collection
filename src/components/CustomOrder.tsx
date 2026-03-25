
import { generateWhatsAppLink, WhatsAppMessages } from "../lib/whatsapp";
import { ArrowRight } from "lucide-react";

const CustomOrder = () => {
  const whatsappLink = generateWhatsAppLink(
    "2347068383089",
    WhatsAppMessages.customOrder
  );

  return (
    <section className="py-16 sm:py-20 bg-amber-600">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading mb-4">
          Want a Custom Hairstyle?
        </h2>

        <p className="text-lg text-amber-100 font-body max-w-xl mx-auto mb-8">
          Tell us your desired look and we'll make it perfect for you. Get
          personalized recommendations and custom-made pieces.
        </p>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-neutral-900 transition-colors hover:bg-neutral-100"
        >
          Chat on WhatsApp
          <ArrowRight className="h-5 w-5" />
        </a>
      </div>
    </section>
  );
};

export default CustomOrder;