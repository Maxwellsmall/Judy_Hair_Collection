import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    text: "The hair was so soft and beautiful. Exceeded my expectations!",
    name: "Ortega",
    role: "Verified Buyer",
  },
  {
    text: "Exactly what I ordered, I love it! Will definitely buy again.",
    name: "Laura",
    role: "Verified Buyer",
  },
  {
    text: "Fast delivery and great quality! Highly recommend this store.",
    name: "Samantha",
    role: "Verified Buyer",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-heading mb-3">
            What Our Customers Say
          </h2>
          <p className="text-lg text-neutral-600 font-body">
            Real reviews from real customers
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-neutral-50 p-8 rounded-xl border border-neutral-200"
            >
              {/* Stars */}
              <div className="flex mb-4 text-amber-600">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>

              <p className="text-neutral-700 font-body text-lg italic leading-relaxed">
                "{item.text}"
              </p>

              <div className="mt-6">
                <p className="font-semibold font-heading text-neutral-900">
                  {item.name}
                </p>
                <p className="text-sm text-neutral-500 font-body">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
