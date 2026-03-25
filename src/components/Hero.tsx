
import Hair3 from "../assets/hair3.jpg";
import { generateWhatsAppLink, WhatsAppMessages } from "../lib/whatsapp";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  backgroundImage?: string;
  title: string;
  subtitle: string;
  supportingText?: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

const defaultProps: HeroProps = {
  backgroundImage: Hair3,
  title: "Luxury Hair Collection",
  subtitle: "Premium Quality Wigs & Bundles",
  supportingText:
    "Discover premium wigs and hairstyles designed to give you confidence and elegance. Up to 40% off on selected items.",
  primaryCtaText: "Shop Now",
  primaryCtaLink: "#products",
  secondaryCtaText: "Learn More",
  secondaryCtaLink: "/about",
};

const Hero = (props: Partial<HeroProps>) => {
  const {
    backgroundImage = defaultProps.backgroundImage,
    title = defaultProps.title,
    subtitle = defaultProps.subtitle,
    supportingText = defaultProps.supportingText,
    primaryCtaText = defaultProps.primaryCtaText,
    secondaryCtaText = defaultProps.secondaryCtaText,
    secondaryCtaLink = defaultProps.secondaryCtaLink,
  } = props;

  const whatsappLink = generateWhatsAppLink(
    "2347068383089",
    WhatsAppMessages.generalGreeting
  );

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Luxury Hair Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white font-heading leading-tight mb-4">
          {title}
        </h1>

        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-100 font-heading mb-6">
          {subtitle}
        </p>

        <p className="text-base sm:text-lg text-neutral-300 font-body max-w-2xl mx-auto mb-10">
          {supportingText}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-8 py-4 font-semibold text-white transition-colors hover:bg-neutral-800 text-lg"
          >
            {primaryCtaText}
            <ArrowRight className="h-5 w-5" />
          </a>

          {secondaryCtaLink && (
            <a
              href={secondaryCtaLink}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-semibold text-neutral-900 transition-colors hover:bg-neutral-100 text-lg"
            >
              {secondaryCtaText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;