"use client";

import { motion, type Variants } from "framer-motion";
import { HelpCircle } from "lucide-react";
import BlurReveal from "./ui/blur-reveal";
import { ArchGallery } from "./ui/arch-gallery";

const steps = [
  {
    num: "01",
    title: "Search properties",
    desc: "Explore a wide range of homes in different locations that match your preferences and budget."
  },
  {
    num: "02",
    title: "Select your home",
    desc: "Carefully review and choose the property that best fits your lifestyle and needs."
  },
  {
    num: "03",
    title: "Book online",
    desc: "Secure your chosen home through a simple, fast, and completely online booking process."
  },
  {
    num: "04",
    title: "Move in",
    desc: "Settle into your new home with ease and confidence, backed by our dedicated support."
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] } 
  }
};

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-[#F6F6F4]">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 text-white text-sm font-medium mb-8">
          <HelpCircle size={16} className="text-[#FFDE02]" />
          <span>How It Works?</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#FFDE02] ml-1" />
        </div>

        {/* Heading */}
        <BlurReveal as="h2" className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-8 text-center max-w-2xl">
          Finding your new home has never been easier
        </BlurReveal>

        {/* Gallery */}
        <div className="w-full overflow-hidden mb-16 hidden md:block mt-12">
          <ArchGallery cardWidth={270} cardHeight={360} />
        </div>

        {/* Steps Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
              className="relative group p-[2px] rounded-3xl overflow-hidden"
            >
              {/* Spinning gradient for border animation (visible on hover) */}
              <div 
                className="absolute inset-[-100%] z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-[spin_3s_linear_infinite]"
                style={{ backgroundImage: "conic-gradient(from 90deg at 50% 50%, transparent 0%, transparent 75%, #FFDE02 100%)" }}
              />
              
              {/* Default Border (visible when not hovered) */}
              <div className="absolute inset-0 z-0 rounded-3xl border border-black/10 group-hover:border-transparent transition-colors duration-500" />
              
              {/* Inner White Card */}
              <div className="relative z-10 flex flex-col h-full bg-white rounded-[22px] p-8 overflow-hidden">
                {/* Large faded background number */}
                <div className="absolute -bottom-6 -right-4 text-9xl font-bold text-black opacity-5 pointer-events-none select-none">
                  {step.num}
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <span className="text-lg font-bold text-black opacity-40 mb-6 block">{step.num}</span>
                  <BlurReveal as="h3" className="text-2xl font-bold mb-4 text-neutral-900">{step.title}</BlurReveal>
                  <p className="text-sm opacity-80 leading-relaxed text-neutral-900">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
