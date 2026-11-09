"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import BlurReveal from "./ui/blur-reveal";

const MARQUEE_TAGS = [
  "Office room",
  "Sublet house",
  "Co-live house",
  "Family home",
  "Modern Villa",
];

export default function AboutBentoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // We use a large height container to allow scrolling, and track its progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Animations mapped to scroll progress (0 = stacked, 1 = expanded grid)
  
  // Left Image: starts from center (105% to right) and moves to its natural place (0%)
  const leftX = useTransform(scrollYProgress, [0, 1], ["105%", "0%"]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
  const leftScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const leftZ = useTransform(scrollYProgress, [0, 0.1], [0, 10]); // stays below initially

  // Right Image: starts from center (-105% to left) and moves to natural place (0%)
  const rightX = useTransform(scrollYProgress, [0, 1], ["-105%", "0%"]);
  const rightOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);
  const rightScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rightZ = useTransform(scrollYProgress, [0, 0.1], [0, 10]); 

  // Cards: stack onto the middle card
  // Top card moves down to overlap middle card
  const topCardY = useTransform(scrollYProgress, [0, 1], ["120%", "0%"]);
  // Bottom card moves up to overlap middle card
  const bottomCardY = useTransform(scrollYProgress, [0, 1], ["-120%", "0%"]);

  return (
    <div className="w-full bg-[#F6F6F4] text-neutral-900 font-sans">
      
      {/* 1. INFINITE MARQUEE TICKER */}
      <div className="w-full pt-16 overflow-hidden whitespace-nowrap border-y border-black/5 py-4 bg-white/50 backdrop-blur-sm z-20 relative">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
          className="flex items-center gap-6 w-max"
        >
          {[...MARQUEE_TAGS, ...MARQUEE_TAGS, ...MARQUEE_TAGS].map((tag, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-white border border-black/10 px-6 py-3 rounded-full shadow-sm text-sm font-semibold"
            >
              <span className="w-2 h-2 rounded-sm bg-black/40" />
              <span>{tag}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 2. ABOUT HEADER & STICKY BENTO GRID */}
      <section ref={containerRef} className="h-[200vh] relative w-full">
        {/* Sticky Container holds the view in place while we scroll through the 200vh */}
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Section Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#111812] text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-[#FFDE02]" />
              About Company
            </div>
            <BlurReveal as="h2" className="text-3xl sm:text-5xl font-bold tracking-tight max-w-3xl leading-snug">
              Whether you're looking for a cozy studio or a spacious family home, we've got you covered.
            </BlurReveal>
          </div>

          {/* Bento Grid layout but animated with Framer Motion */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch w-full relative z-10">
            
            {/* Column 1: Left Image */}
            <motion.div
              style={{ x: leftX, opacity: leftOpacity, scale: leftScale, zIndex: leftZ }}
              className="relative min-h-[clamp(380px,55vh,520px)] rounded-3xl overflow-hidden shadow-sm hidden lg:block"
            >
              <Image 
                alt="Modern wooden house" 
                className="object-cover" 
                fill 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </motion.div>

            {/* Column 2: Center Stack Cards */}
            <div className="flex flex-col gap-6 justify-between relative z-20 h-[clamp(380px,55vh,520px)]">
              {/* Card Top */}
              <motion.div 
                style={{ y: topCardY }}
                className="bg-white border border-black/5 rounded-3xl p-8 flex items-center justify-between shadow-lg flex-1 relative z-30"
              >
                <span className="text-4xl font-extrabold tracking-tight">$7.5M</span>
                <span className="text-xs font-medium text-neutral-500 max-w-[100px] text-right">
                  Total value managed
                </span>
              </motion.div>

              {/* Card Middle (Yellow Accent) */}
              <motion.div 
                className="bg-[#FFDE02] rounded-3xl p-8 flex items-center justify-between shadow-lg flex-1 relative z-20"
              >
                <span className="text-4xl font-extrabold tracking-tight">120+</span>
                <span className="text-xs font-semibold text-neutral-900 max-w-[100px] text-right">
                  Total property managed
                </span>
              </motion.div>

              {/* Card Bottom (Dark Navy) */}
              <motion.div 
                style={{ y: bottomCardY }}
                className="bg-[#111812] text-white rounded-3xl p-8 flex items-center justify-between shadow-lg flex-1 relative z-10"
              >
                <span className="text-4xl font-extrabold tracking-tight">230+</span>
                <span className="text-xs font-medium text-neutral-400 max-w-[100px] text-right">
                  Happy clients
                </span>
              </motion.div>
            </div>

            {/* Column 3: Right Image */}
            <motion.div
              style={{ x: rightX, opacity: rightOpacity, scale: rightScale, zIndex: rightZ }}
              className="relative min-h-[clamp(380px,55vh,520px)] rounded-3xl overflow-hidden shadow-sm hidden lg:block"
            >
              <Image 
                alt="Modern glass villa" 
                className="object-cover" 
                fill 
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
