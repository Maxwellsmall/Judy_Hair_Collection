import React from "react";
import { motion } from "framer-motion";
import Hair5 from "../assets/hair5.jpg";
import Hair3 from "../assets/hair3.jpg";
import Hair4 from "../assets/hair4.jpg";
import Hair6 from "../assets/hair6.jpg";
import Hair1 from "../assets/hair1.jpg";
import Hair2 from "../assets/hair2.jpg";
import {Link } from "react-router-dom"

const styles = [
  { name: "Bone Straight", link: "/category/straight", image: Hair3 },
  { name: "Curly", link: "/category/curly", image: Hair4 },
  { name: "Frontal", link: "/category/frontal", image: Hair6 },
  { name: "Braids", link: "/category/braids", image: Hair1 },
];

const lookbook = [
  { image: Hair3 },
  { image: Hair4 },
  { image: Hair6 },
  { image: Hair3 },
  { image: Hair6 },
  { image: Hair2 },
  { image: Hair5 },
  { image: Hair3 },
  { image: Hair4 },
  { image: Hair1 },
  { image: Hair2 },
  { image: Hair1 },
];

const Hairstyles = () => {
  return (
    <div className="bg-white text-gray-800">
      <section className="relative h-[70vh] flex items-center justify-center text-center">
        <img
          src={Hair3}
          alt="Featured hairstyle"
          className="absolute w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60"></div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-white px-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Explore Hairstyles That Define You
          </h1>
          <p className="max-w-2xl mx-auto text-lg">
            Your hairstyle is more than just a look — it's your identity, your
            confidence, and your expression.
          </p>
        </motion.div>
      </section>

      <section className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-6 py-16">
        {styles.map((style, i) => (
          <motion.a
            key={i}
            href={style.link}
            className="relative group rounded-2xl overflow-hidden shadow-lg"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <img
              src={style.image}
              alt={style.name}
              className="w-full h-[300px] object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500">
              <h2 className="text-white text-2xl font-semibold">
                {style.name}
              </h2>
            </div>
          </motion.a>
        ))}
      </section>

      <section className="py-20 text-center px-6">
        <h2 className="text-3xl font-semibold mb-10">Browse by Vibe</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {["Everyday", "Luxury", "Bold", "Soft Glam"].map((item, i) => (
            <motion.div
              key={i}
              className="px-6 py-3 border rounded-full cursor-pointer hover:bg-gray-100 transition duration-300"
              whileHover={{ scale: 1.1 }}
            >
              {item}
            </motion.div>
          ))}
        </div>
      </section>
      {/* 
      Lookbook
      <section className="py-20 px-6">
        <h2 className="text-4xl text-center mb-10">Lookbook</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {lookbook.map((item, i) => {
            // Top row → vertical, middle row → horizontal, bottom → mix
            let motionProps = {};
            if (i < 4) {
              // Top row → vertical
              motionProps = {
                initial: { opacity: 0, y: 50 },
                whileInView: { opacity: 1, y: 0 },
              };
            } else if (i < 8) {
              // Middle row → horizontal
              motionProps = {
                initial: { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
                whileInView: { opacity: 1, x: 0 },
              };
            } else {
              // Bottom row → mix vertical and horizontal
              motionProps = {
                initial: {
                  opacity: 0,
                  x: i % 2 === 0 ? -50 : 0,
                  y: i % 2 !== 0 ? 50 : 0,
                },
                whileInView: { opacity: 1, x: 0, y: 0 },
              };
            }

            return (
              <motion.div
                key={i}
                className="overflow-hidden rounded-xl shadow-md"
                {...motionProps}
                transition={{ duration: 2.1, delay: i * 0.1 }}
                viewport={{ once: true, amount: 0.5 }} // triggers when 30% visible
              >
                <img
                  src={item.image}
                  alt={`Lookbook style ${i + 1}`}
                  className="w-full h-56 object-cover"
                />
              </motion.div>
            );
          })}
        </div>
      </section> */}

      <section className="py-20 px-6 overflow-hidden">
        <h2 className="text-4xl text-center mb-10">Lookbook</h2>

        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          <motion.div
            className="grid grid-cols-4 gap-4"
            animate={{ y: ["0%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          >
            {lookbook.slice(0, 4).map((item, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl shadow-md h-56"
              >
                <img
                  src={item.image}
                  alt={`Top row style ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>

          <motion.div
            className="grid grid-cols-4 gap-4"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          >
            {lookbook.slice(4, 8).map((item, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-xl shadow-md h-56"
              >
                <img
                  src={item.image}
                  alt={`Middle row style ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </motion.div>

          <div className="grid grid-cols-4 gap-4">
            {lookbook.slice(8, 12).map((item, i) => (
              <motion.div
                key={i}
                className="overflow-hidden rounded-xl shadow-md h-56"
                animate={
                  i % 2 === 0
                    ? { y: ["0%", "-30%", "0%"] } 
                    : { x: ["0%", "30%", "0%"] }
                }
                transition={{
                  repeat: Infinity,
                  duration: 5 + i,
                  ease: "easeInOut",
                }}
              >
                <img
                  src={item.image}
                  alt={`Bottom row style ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center px-6">
        <h2 className="text-3xl font-semibold mb-6">Style Tips</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          If you prefer a clean and elegant look, straight styles are perfect.
          For volume and personality, curly wigs are a great choice.
        </p>
      </section>

      <section className="py-20 text-center bg-black text-white">
        <h2 className="text-3xl mb-4">Ready to Find Your Style?</h2>
       
      
        <Link to="/category" className="">
        
          Shop Collection
        </Link>

      </section>
    </div>
  );
};

export default Hairstyles;
