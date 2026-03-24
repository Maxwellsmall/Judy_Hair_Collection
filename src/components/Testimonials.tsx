import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    text: "The hair was so soft and beautiful ",
    name: "Ortega",
  },
  {
    text: "Exactly what I ordered, I love it!",
    name: "Laura",
  },
  {
    text: "Fast delivery and great quality!",
    name: "Samantha",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-[#f9f9f9]">
      <h2 className="text-3xl font-bold text-center mb-14">
        What Our Customers Say
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {testimonials.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition"
          >
            {/* Stars */}
            <div className="flex mb-3 text-[#D4AF37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#D4AF37" />
              ))}
            </div>

            <p className="text-gray-600 italic">"{item.text}"</p>

            <p className="mt-4 font-semibold">{item.name}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
