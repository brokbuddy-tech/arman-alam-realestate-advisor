"use client";

import { motion } from "framer-motion";
import BlurReveal from "./ui/blur-reveal";
import { HeroFilterCard } from "./HeroFilterCard";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-between px-6 py-20 overflow-hidden bg-zinc-900 lg:rounded-b-[40px]">
      {/* Background Video Setup */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover opacity-60"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/60 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center w-full gap-12 mt-16">
        <motion.div
          className="flex-1 text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <BlurReveal as="h1" className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            A property tailored to your lifestyle
          </BlurReveal>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-[#FFDF00] text-black font-semibold rounded-full text-lg shadow-lg hover:bg-yellow-400 transition-colors"
          >
            Explore Properties
          </motion.button>
        </motion.div>

        {/* Search & Filter Card on the right */}
        <HeroFilterCard />
      </div>
    </section>
  );
}
