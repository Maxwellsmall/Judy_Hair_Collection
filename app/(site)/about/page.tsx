"use client";

import { motion } from "framer-motion";
import Hair5 from "../../../src/assets/hair5.jpg";



export default function AboutPage() {
  return (
    <section className="bg-white text-gray-800">
      {/* HERO */}
      <div className="relative h-[80vh] flex items-center justify-center text-center">
        <img
          src={Hair5.src}
          alt="Hair"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70"></div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative text-white px-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            More Than Hair — It's Confidence, Identity & Expression
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
            We don't just sell wigs — we help you step into your most confident
            self. Every strand we provide is designed to enhance your beauty,
            elevate your presence, and give you that undeniable feeling of
            confidence wherever you go.
          </p>
        </motion.div>
      </div>

      {/* STORY */}
      <div className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.img
          src={Hair5.src}
          alt="Hair"
          className="rounded-2xl shadow-xl"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        />

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-semibold mb-6">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Our journey started with a simple but powerful vision — to redefine
            how women experience beauty through hair. We noticed that many wigs
            in the market lacked durability, natural feel, and true value for
            money. That's when we decided to do things differently.
          </p>

          <p className="text-gray-600 leading-relaxed mb-4">
            From sourcing premium raw hair to carefully crafting each piece, we
            focus on quality at every stage. We believe hair is not just an
            accessory — it is a statement, a confidence booster, and sometimes,
            even a form of self-expression.
          </p>

          <p className="text-gray-600 leading-relaxed">
            Today, we proudly serve a growing community of women who trust us
            for consistency, beauty, and authenticity. And this is just the
            beginning of something even bigger.
          </p>
        </motion.div>
      </div>

      {/* MISSION & VISION */}
      <div className="bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          {[
            {
              title: "Our Mission",
              text: "To empower women by providing high-quality wigs that enhance confidence, celebrate individuality, and make beauty accessible without compromising on quality or affordability.",
            },
            {
              title: "Our Vision",
              text: "To become a leading brand known for excellence, trust, and innovation in the hair industry — where every woman can find her perfect look effortlessly.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-md"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="py-20 px-6">
        <h2 className="text-4xl font-semibold text-center mb-12">
          Why Choose Us
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              title: "Premium Quality",
              text: "We source only the finest hair to ensure softness, durability, and a natural look that lasts over time.",
            },
            {
              title: "Affordable Luxury",
              text: "Luxury shouldn't break the bank. We provide top-tier wigs at prices that remain accessible.",
            },
            {
              title: "Customer First",
              text: "Your satisfaction is our priority. From order to delivery, we ensure a seamless experience.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* TRUST SECTION */}
      <div className="bg-black text-white py-20 px-6 text-center">
        <motion.h2
          className="text-4xl font-semibold mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          Trusted by Women Who Value Quality
        </motion.h2>

        <p className="max-w-3xl mx-auto text-gray-300 leading-relaxed mb-10">
          Over time, we've built a reputation based on trust, quality, and
          consistency. Our customers don't just buy once — they come back,
          because they know exactly what to expect: excellence.
        </p>

        <div className="flex justify-center gap-10 text-2xl font-bold text-[#D4AF37]">
          <div>500+ Clients</div>
          <div>1000+ Orders</div>
          <div>5★ Reviews</div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 px-6 text-center">
        <motion.h2
          className="text-4xl font-semibold mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          Discover Your Perfect Look Today
        </motion.h2>

        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Whether you're looking for elegance, boldness, or everyday beauty, we
          have something crafted just for you. Step into confidence today.
        </p>

        <a
          href="/hairstyles"
          className="bg-[#D4AF37] text-black px-8 py-3 rounded-lg font-semibold hover:scale-105 transition"
        >
          Explore Collection
        </a>
      </div>
    </section>
  );
}
