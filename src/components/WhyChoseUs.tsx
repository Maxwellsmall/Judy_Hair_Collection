"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, Gem, Wallet } from "lucide-react";

const features = [
  {
    title: "Affordable",
    desc: "Luxury hair at prices you'll love",
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
    <section className="py-16 sm:py-20 bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-3">
            Why Choose{" "}
            <span className="text-amber-600">Judy Hair</span>
          </h2>
          <p className="text-lg text-neutral-400 font-body">
            The Judy Hair Collection difference
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((item, i) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm p-6 sm:p-8 rounded-xl text-center hover:bg-white/10 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-600/20 mb-4">
                  <Icon size={32} className="text-amber-600" />
                </div>

                <p className="font-semibold text-lg font-heading mb-2">
                  {item.title}
                </p>
                <p className="text-sm text-neutral-400 font-body">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChoseUs;
