"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Hair5 from "../../../src/assets/hair5.jpg";



export default function AboutPage() {
  return (
    <section className="bg-white text-neutral-900">
      {/* HERO */}
      <div className="relative h-[80vh] flex items-center justify-center text-center overflow-hidden">
        <img
          src={Hair5.src}
          alt="Judy Hair Collection Premium Hair"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative text-white px-6 max-w-5xl"
        >
          <h1 className="text-5xl md:text-7xl font-heading text-white mb-8 tracking-tight leading-tight">
            More Than Hair &mdash; It&apos;s Confidence, Identity & Expression
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl font-body leading-relaxed text-neutral-200">
            We don&apos;t just sell wigs &mdash; we help you step into your most confident
            self. Every strand we provide is designed to enhance your beauty,
            elevate your presence, and give you that undeniable feeling of
            confidence wherever you go.
          </p>
        </motion.div>
      </div>

      {/* STORY */}
      <div className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
        >
          <img
            src={Hair5.src}
            alt="The Judy Hair Collection Story"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-heading tracking-tight">Our Story</h2>
          <div className="space-y-4 text-neutral-600 font-body text-lg leading-relaxed">
            <p>
              Our journey started with a simple but powerful vision &mdash; to redefine
              how women experience beauty through hair. We noticed that many wigs
              in the market lacked durability, natural feel, and true value for
              money. That&apos;s when we decided to do things differently.
            </p>

            <p>
              From sourcing premium raw hair to carefully crafting each piece, we
              focus on quality at every stage. We believe hair is not just an
              accessory &mdash; it is a statement, a confidence booster, and sometimes,
              even a form of self-expression.
            </p>

            <p>
              Today, we proudly serve a growing community of women who trust us
              for consistency, beauty, and authenticity. And this is just the
              beginning of something even bigger.
            </p>
          </div>
        </motion.div>
      </div>

      {/* MISSION & VISION */}
      <div className="bg-neutral-50 py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
          {[
            {
              title: "Our Mission",
              text: "To empower women by providing high-quality wigs that enhance confidence, celebrate individuality, and make beauty accessible without compromising on quality or affordability.",
            },
            {
              title: "Our Vision",
              text: "To become a leading brand known for excellence, trust, and innovation in the hair industry &mdash; where every woman can find her perfect look effortlessly.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white p-10 rounded-2xl shadow-sm border border-neutral-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <h3 className="text-3xl font-heading mb-6 tracking-tight">{item.title}</h3>
              <p className="text-neutral-600 font-body text-lg leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-heading tracking-tight">Why Choose Us</h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
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
                className="bg-neutral-50 p-10 rounded-2xl border border-transparent hover:border-neutral-200 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <h3 className="text-2xl font-heading mb-4 tracking-tight">{item.title}</h3>
                <p className="text-neutral-600 font-body leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* TRUST SECTION */}
      <div className="bg-neutral-900 text-white py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.h2
            className="text-4xl md:text-5xl font-heading text-white tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Trusted by Women Who Value Quality
          </motion.h2>

          <p className="max-w-2xl mx-auto text-neutral-400 font-body text-lg leading-relaxed">
            Over time, we&apos;ve built a reputation based on trust, quality, and
            consistency. Our customers don&apos;t just buy once &mdash; they come back,
            because they know exactly what to expect: excellence.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-12 pt-8">
            <div className="space-y-2">
              <div className="text-5xl font-heading text-amber-600">500+</div>
              <div className="text-sm font-body uppercase tracking-widest text-neutral-500">Happy Clients</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-heading text-amber-600">1000+</div>
              <div className="text-sm font-body uppercase tracking-widest text-neutral-500">Orders Delivered</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-heading text-amber-600">5★</div>
              <div className="text-sm font-body uppercase tracking-widest text-neutral-500">Average Review</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-24 px-6 text-center bg-white">
        <div className="max-w-3xl mx-auto space-y-8">
          <motion.h2
            className="text-4xl md:text-5xl font-heading tracking-tight"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Discover Your Perfect Look Today
          </motion.h2>

          <p className="text-neutral-600 font-body text-lg leading-relaxed max-w-2xl mx-auto">
            Whether you&apos;re looking for elegance, boldness, or everyday beauty, we
            have something crafted just for you. Step into confidence today.
          </p>

          <div className="pt-4">
            <Link
              href="/hairstyles"
              className="btn-primary"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
