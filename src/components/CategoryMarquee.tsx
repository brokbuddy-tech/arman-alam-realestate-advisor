"use client";

import { motion } from "framer-motion";

const categories = [
  "Sublet house", "Co-live house", "Luxury Villa", "Penthouse", 
  "Studio Apartment", "Office Space", "Townhouse", "Beachfront",
  "Sublet house", "Co-live house", "Luxury Villa", "Penthouse" // Duplicated for seamless loop
];

export default function CategoryMarquee() {
  return (
    <section className="py-12 bg-white overflow-hidden border-b border-gray-100">
      <div className="flex w-[200%] gap-4">
        <motion.div
          className="flex space-x-4 shrink-0"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        >
          {categories.map((cat, index) => (
            <button
              key={index}
              className="px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors shrink-0"
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
