import ServiceCard from "./ServiceCard";
import type { ServiceCardProps } from "./ServiceCard";
import { WhatsAppMessages } from "../lib/whatsapp";

const services: ServiceCardProps[] = [
  {
    id: "wigging",
    title: "Professional Wigging",
    description:
      "Expert wig installation and customization for a natural, flawless look that boosts your confidence.",
    whatsappMessage: WhatsAppMessages.bookWiggingService,
  },
  {
    id: "revamping",
    title: "Wig Revamping",
    description:
      "Restore your old wigs to their former glory with our professional cleaning, styling, and repair services.",
    whatsappMessage: WhatsAppMessages.bookRevampingService,
  },
  {
    id: "styling",
    title: "Hair Styling",
    description:
      "Custom styling services for wigs and natural hair. From cuts to color, we create your perfect look.",
    whatsappMessage: WhatsAppMessages.bookStylingService,
  },
];

interface ServicesSectionProps {
  title?: string;
  subtitle?: string;
}

/**
 * ServicesSection Component
 * 
 * Displays a grid of all available services.
 */
const ServicesSection = ({
  title = "Our Services",
  subtitle = "Professional hair care and styling services tailored to your needs",
}: ServicesSectionProps) => {
  return (
    <section className="py-20 bg-background-light">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-main font-heading mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 font-body max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
