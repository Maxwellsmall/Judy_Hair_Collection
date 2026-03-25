import { MessageCircle } from "lucide-react";
import { generateWhatsAppLink, WhatsAppMessages } from "../lib/whatsapp";

export interface FloatingWhatsAppButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
  position?: "bottom-right" | "bottom-left";
}

/**
 * FloatingWhatsAppButton Component
 * 
 * Fixed position button (FAB) that allows users to quickly contact the business.
 * Features a pulsing animation to draw attention.
 * 
 * @param phoneNumber - WhatsApp phone number (defaults to business number)
 * @param defaultMessage - Pre-filled message (defaults to general greeting)
 * @param position - Button position (defaults to bottom-right)
 */
const FloatingWhatsAppButton = ({
  phoneNumber = "2347068383089",
  defaultMessage = WhatsAppMessages.generalGreeting,
  position = "bottom-right",
}: FloatingWhatsAppButtonProps) => {
  const whatsappLink = generateWhatsAppLink(phoneNumber, defaultMessage);

  const positionClasses =
    position === "bottom-right"
      ? "bottom-6 right-6"
      : "bottom-6 left-6";

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed ${positionClasses} z-50 flex items-center justify-center w-16 h-16 bg-whatsapp-green rounded-full shadow-2xl hover:bg-whatsapp-green/90 transition-all duration-300 transform hover:scale-110 group`}
      aria-label="Chat on WhatsApp"
    >
      {/* Pulsing animation rings */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-whatsapp-green opacity-75 animate-ping"></span>
      <span className="absolute inline-flex h-[120%] w-[120%] rounded-full bg-whatsapp-green opacity-50 animate-pulse"></span>

      {/* WhatsApp Icon */}
      <MessageCircle className="relative w-8 h-8 text-white" />

      {/* Tooltip */}
      <span className="absolute right-full mr-4 px-3 py-2 bg-background-dark text-white text-sm font-body rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap hidden md:block">
        Chat with us
      </span>
    </a>
  );
};

export default FloatingWhatsAppButton;
