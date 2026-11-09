"use client";

import { motion } from "framer-motion";
import { MessageSquareQuote, Newspaper, ArrowUpRight, Star } from "lucide-react";
import BlurReveal from "./ui/blur-reveal";

const logos = [
  "Acme Corp", "GlobalTech", "Nexus", "Quantum", "Zephyr", "Astra",
  "Acme Corp", "GlobalTech", "Nexus", "Quantum", "Zephyr", "Astra"
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function BottomSections() {
  return (
    <>
      {/* 1. Testimonials & Marquee (Dark) */}
      <section className="bg-[#111812] text-white overflow-hidden py-24 relative rounded-t-[40px] -mt-10 z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center mb-16">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 text-white text-sm font-medium mb-8">
              <MessageSquareQuote size={16} className="text-[#FFDE02]" />
              <span>Users Feedback</span>
            </div>
            <BlurReveal as="h2" className="text-4xl md:text-5xl font-bold tracking-tight text-center max-w-2xl">
              Our clients' words tell the real story
            </BlurReveal>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24"
          >
            {/* Left Side: Clutch & Stats */}
            <motion.div variants={slideInLeft} className="col-span-1 md:col-span-4 flex flex-col justify-center border-r border-white/10 pr-8">
              <div className="mb-6 flex items-center gap-2">
                <span className="font-bold text-xl tracking-wider uppercase">Clutch</span>
              </div>
              <div className="flex gap-1 mb-2 text-[#FFDE02]">
                {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
              </div>
              <div className="flex items-baseline gap-3 mb-2">
                <BlurReveal as="h3" className="text-6xl font-bold">4.95</BlurReveal>
                <span className="text-gray-400 text-lg">/ 5.0</span>
              </div>
              <p className="text-gray-400 mb-8 max-w-xs">
                Based on 200+ verified client reviews and ratings.
              </p>
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-[#111812] overflow-hidden bg-gray-600">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Side: The Review */}
            <motion.div variants={slideInRight} className="col-span-1 md:col-span-8 flex flex-col justify-center pl-0 md:pl-8">
              <div className="flex gap-1 mb-8 text-[#FFDE02]">
                {[...Array(5)].map((_, i) => <Star key={i} size={24} fill="currentColor" />)}
              </div>
              <p className="text-3xl md:text-4xl font-medium leading-relaxed mb-8 text-gray-200">
                "I found my dream apartment in just three days. The process was incredibly seamless, and the agent was extremely helpful throughout the entire journey."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-600">
                  <img src="https://i.pravatar.cc/150?img=44" alt="Almond D. Dawson" className="w-full h-full object-cover" />
                </div>
                <div>
                  <BlurReveal as="h4" className="font-bold text-lg">Almond D. Dawson</BlurReveal>
                  <p className="text-[#FFDE02] font-medium opacity-90 glowing-text">Smoothest rental experience ever!</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Infinite Logo Marquee */}
        <div className="w-full border-y border-white/10 py-8 bg-black/20">
          <div className="flex w-[200%] overflow-hidden">
            <motion.div
              className="flex items-center justify-around w-1/2 shrink-0"
              animate={{ x: ["0%", "-100%"] }}
              transition={{ duration: 25, ease: "linear", repeat: Infinity }}
            >
              {logos.slice(0, 6).map((logo, index) => (
                <div key={index} className="text-2xl font-bold text-white/40 uppercase tracking-widest mx-8">
                  {logo}
                </div>
              ))}
            </motion.div>
            <motion.div
              className="flex items-center justify-around w-1/2 shrink-0"
              animate={{ x: ["0%", "-100%"] }}
              transition={{ duration: 25, ease: "linear", repeat: Infinity }}
            >
              {logos.slice(6, 12).map((logo, index) => (
                <div key={`dup-${index}`} className="text-2xl font-bold text-white/40 uppercase tracking-widest mx-8">
                  {logo}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* 2. Company Insights (Light) */}
      <section className="bg-[#F6F6F4] text-neutral-900 py-24 pb-48 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/10 bg-white text-sm font-medium mb-4 inline-flex">
                <Newspaper size={16} className="text-[#FFDE02]" />
                <span>News & Feeds</span>
              </div>
              <BlurReveal as="h2" className="text-4xl md:text-5xl font-bold tracking-tight">Company insights</BlurReveal>
            </div>
            <button className="hidden md:flex px-6 py-3 rounded-full border border-black/10 font-medium hover:bg-white transition-colors">
              View all posts
            </button>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Left Item (Large) */}
            <motion.div variants={slideInLeft} className="group bg-white rounded-3xl p-4 flex flex-col cursor-pointer border border-black/5 hover:shadow-xl transition-shadow">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 relative">
                <img 
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800" 
                  alt="Staircase" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">House</div>
              </div>
              <div className="px-4 pb-4 flex flex-col flex-1 justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-2">March 12, 2024</p>
                  <BlurReveal as="h3" className="text-2xl font-bold mb-4 leading-tight group-hover:text-yellow-600 transition-colors">
                    From compact studios to roomy apartments, find your fit
                  </BlurReveal>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-[#FFDE02] transition-colors mt-4">
                  <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </motion.div>

            {/* Right Column (Stacked) */}
            <div className="flex flex-col gap-6">
              {/* Top Right */}
              <motion.div variants={slideInRight} className="group bg-white rounded-3xl p-4 flex flex-col sm:flex-row gap-6 cursor-pointer border border-black/5 hover:shadow-xl transition-shadow h-full">
                <div className="w-full sm:w-2/5 aspect-square sm:aspect-auto rounded-2xl overflow-hidden shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=600" 
                    alt="Interior" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex flex-col justify-between py-2 pr-2">
                  <div>
                    <div className="flex gap-3 mb-3">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold">Tips</span>
                      <span className="text-sm text-gray-500 py-1">Feb 28, 2024</span>
                    </div>
                    <BlurReveal as="h3" className="text-xl font-bold leading-tight group-hover:text-yellow-600 transition-colors">
                      No matter your lifestyle, we have the perfect home
                    </BlurReveal>
                  </div>
                  <div className="w-10 h-10 bg-[#FFDE02] rounded-xl flex items-center justify-center mt-4 shadow-sm self-end">
                    <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>

              {/* Bottom Right */}
              <motion.div variants={slideInRight} className="group bg-white rounded-3xl p-4 flex flex-col sm:flex-row gap-6 cursor-pointer border border-black/5 hover:shadow-xl transition-shadow h-full">
                <div className="w-full sm:w-2/5 aspect-square sm:aspect-auto rounded-2xl overflow-hidden shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600" 
                    alt="Exterior" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex flex-col justify-between py-2 pr-2">
                  <div>
                    <div className="flex gap-3 mb-3">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold">Guide</span>
                      <span className="text-sm text-gray-500 py-1">Jan 15, 2024</span>
                    </div>
                    <BlurReveal as="h3" className="text-xl font-bold leading-tight group-hover:text-yellow-600 transition-colors">
                      Big or small, modern or classic: Exploring architectural styles
                    </BlurReveal>
                  </div>
                  <div className="w-10 h-10 bg-[#FFDE02] rounded-xl flex items-center justify-center mt-4 shadow-sm self-end">
                    <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* 3. Footer with overlapping CTA and Massive Text */}
      <footer className="relative bg-[#111812] text-white pt-48 pb-0 flex flex-col min-h-[80vh] z-20">
         {/* Overlapping CTA */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl px-6 z-30">
           <div className="bg-[#111812] rounded-3xl border border-white/10 p-12 overflow-hidden relative shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
             {/* Background Image Overlay */}
             <div className="absolute inset-0 z-0 opacity-20">
               <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600" alt="CTA bg" className="w-full h-full object-cover" />
             </div>
             
             <div className="relative z-10 w-full md:w-1/2">
               <BlurReveal as="h2" className="text-4xl md:text-6xl font-bold leading-tight">Ready to book a free tour?</BlurReveal>
             </div>
             
             <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
               <div className="flex flex-col items-center sm:items-end text-right">
                 <span className="text-gray-400 text-sm mb-1">Call us directly</span>
                 <a href="tel:+1234567890" className="text-2xl font-bold hover:text-[#FFDE02] transition-colors">+1 (234) 567 890</a>
               </div>
               <button className="px-8 py-4 bg-[#FFDE02] text-black font-bold rounded-full text-lg shadow-lg hover:bg-yellow-400 transition-colors whitespace-nowrap">
                 Book appointment
               </button>
             </div>
           </div>
         </div>

         {/* Footer Links Grid */}
         <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col justify-center mb-12">
           <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10 pb-16">
             {/* About & Trust */}
             <div className="col-span-1 md:col-span-4">
               <BlurReveal as="h3" className="text-2xl font-bold mb-6">Manzi Real Estate</BlurReveal>
               <p className="text-gray-400 mb-8 max-w-sm leading-relaxed">
                 We are dedicated to helping you find the perfect home that fits your lifestyle. Premium quality, exceptional service.
               </p>
               <div className="flex gap-4">
                 <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-[#FFDE02]"><Star size={20} /></div>
                 <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-[#FFDE02]"><Star size={20} /></div>
                 <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-[#FFDE02]"><Star size={20} /></div>
               </div>
             </div>

             {/* Links */}
             <div className="col-span-1 md:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div>
                 <BlurReveal as="h4" className="font-bold mb-6 text-lg">Essential</BlurReveal>
                 <ul className="flex flex-col gap-4 text-gray-400">
                   <li><a href="#" className="hover:text-white transition-colors">Home Listings</a></li>
                   <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                   <li><a href="#" className="hover:text-white transition-colors">Get in Touch</a></li>
                   <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                 </ul>
               </div>
               <div>
                 <BlurReveal as="h4" className="font-bold mb-6 text-lg">Legal</BlurReveal>
                 <ul className="flex flex-col gap-4 text-gray-400">
                   <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                   <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                   <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                 </ul>
               </div>
             </div>

             {/* Newsletter */}
             <div className="col-span-1 md:col-span-4">
               <BlurReveal as="h4" className="font-bold mb-6 text-lg">Get weekly updates</BlurReveal>
               <p className="text-gray-400 mb-6">Subscribe to our newsletter for the latest property news and market trends.</p>
               <form className="relative" onSubmit={(e) => e.preventDefault()}>
                 <input 
                   type="email" 
                   placeholder="Enter your email address" 
                   className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 outline-none focus:border-[#FFDE02] transition-colors text-white"
                 />
                 <button 
                   type="submit" 
                   className="absolute right-2 top-2 bottom-2 bg-[#FFDE02] text-black font-bold px-6 rounded-full hover:bg-yellow-400 transition-colors"
                 >
                   Subscribe
                 </button>
               </form>
             </div>
           </div>
           
           <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
             <p>© 2024 Manzi Real Estate. All rights reserved.</p>
             <div className="flex gap-6 mt-4 md:mt-0">
               <a href="#" className="hover:text-white transition-colors">Facebook</a>
               <a href="#" className="hover:text-white transition-colors">Twitter</a>
               <a href="#" className="hover:text-white transition-colors">Instagram</a>
             </div>
           </div>
         </div>

         {/* Massive Cut-off Text */}
         <div className="relative w-full overflow-hidden flex justify-center -mb-[5vw] pointer-events-none mt-auto">
           <BlurReveal as="h1" 
             className="font-bold leading-none select-none text-[22vw] tracking-tighter"
             style={{ 
               color: "transparent",
               WebkitTextStroke: "2px rgba(255,255,255,0.06)",
             }}
           >
             MANZI
           </BlurReveal>
         </div>
      </footer>
    </>
  );
}
