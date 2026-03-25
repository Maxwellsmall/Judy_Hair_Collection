import { generateWhatsAppLink } from "../lib/whatsapp";

export interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  iconUrl?: string;
  whatsappMessage: string;
  phoneNumber?: string;
}

/**
 * ServiceCard Component
 * 
 * Displays a service (Wigging, Revamping, Styling).
 * Clicking the CTA opens WhatsApp with a pre-filled message.
 */
const ServiceCard = ({
  id,
  title,
  description,
  iconUrl,
  whatsappMessage,
  phoneNumber = "2347068383089",
}: ServiceCardProps) => {
  const whatsappLink = generateWhatsAppLink(phoneNumber, whatsappMessage);

  return (
    <div
      className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
      role="article"
      aria-labelledby={`service-title-${id}`}
    >
      {iconUrl && (
        <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
          <img
            src={iconUrl}
            alt={`${title} icon`}
            className="w-10 h-10 object-contain"
          />
        </div>
      )}

      <h3
        id={`service-title-${id}`}
        className="text-2xl font-bold text-text-main font-heading mb-3"
      >
        {title}
      </h3>

      <p className="text-gray-600 font-body mb-6 leading-relaxed">
        {description}
      </p>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold font-body hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
      >
        Book Now
      </a>
    </div>
  );
};

export default ServiceCard;
