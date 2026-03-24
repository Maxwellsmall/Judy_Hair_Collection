import { motion } from "framer-motion";
import { Truck, ShieldCheck, Gem, Wallet } from "lucide-react";

const features = [
  {
    title: "Affordable",
    desc: "Luxury hair at prices you’ll love",
    icon: Wallet,
  },
  {
    title: "Premium Quality",
    desc: "Soft, durable, and long-lasting",
    icon: Gem,
  },
  {
    title: "Fast Delivery",
    desc: "Quick and reliable service",
    icon: Truck,
  },
  {
    title: "Trusted",
    desc: "Loved by our happy customers",
    icon: ShieldCheck,
  },
];

const WhyChoseUs = () => {
  return (
    <section className="py-20 bg-black text-white">
      <h2 className="text-3xl font-bold text-center mb-14">
        Why Choose <span className="text-[#D4AF37]">Judy Hair</span>
      </h2>

      <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
        {features.map((item, i) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-[#1a1a1a] p-6 rounded-xl text-center hover:scale-105 transition duration-300"
            >
              <Icon size={40} className="mx-auto text-[#D4AF37] mb-4" />

              <p className="font-semibold text-lg">{item.title}</p>
              <p className="text-sm text-gray-400 mt-2">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default WhyChoseUs;
