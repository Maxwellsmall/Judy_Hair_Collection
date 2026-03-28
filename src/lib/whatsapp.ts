/**
 * WhatsApp Utility Functions
 * 
 * Helper functions to generate WhatsApp links with pre-filled messages.
 * All user actions (booking, buying, shipping negotiations) funnel to WhatsApp.
 */

const PHONE_NUMBER = "393519420168"; // Judy Hair Collection WhatsApp number

/**
 * Generates a WhatsApp link with a pre-filled message
 * @param phone - Phone number (defaults to business number)
 * @param message - The pre-filled message text
 * @returns A WhatsApp URL that opens a chat with the message
 */
export const generateWhatsAppLink = (
  phone: string = PHONE_NUMBER,
  message: string
): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};

/**
 * Pre-defined messages for different actions
 */
export const WhatsAppMessages = {
  // Product inquiries
  productInquiry: (productName: string) =>
    `Hello, I am interested in the ${productName}. Please share more details.`,
  
  // Service bookings
  bookWiggingService: "Hello, I want to book a wigging service.",
  bookRevampingService: "Hello, I want to book a revamping service.",
  bookStylingService: "Hello, I want to book a styling service.",
  
  // Custom orders
  customOrder: "Hello, I want to place a custom order. Please guide me.",
  
  // General
  generalGreeting: "Hello, I'm interested in Judy Hair Collection products.",
  shippingInquiry: "Hello, I want to inquire about shipping options.",
};

/**
 * Default phone number for the business
 */
export const BUSINESS_PHONE = PHONE_NUMBER;
