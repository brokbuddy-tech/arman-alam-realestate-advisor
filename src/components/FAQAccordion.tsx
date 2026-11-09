"use client";

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { MessageCircle, Plus, Minus } from "lucide-react";
import BlurReveal from "./ui/blur-reveal";

const faqs = [
  {
    id: 1,
    question: "Will the rent increase next year?",
    answer: "This is the most fundamental question to ask when renting a house. Our leases typically have fixed rates for the first year, with clear clauses detailing any potential adjustments based on market rates thereafter.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 2,
    question: "Is the house furnished or unfurnished?",
    answer: "We offer both options. Furnished homes come with modern appliances, premium furniture, and basic utilities, while unfurnished units give you a blank canvas to personalize your space.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 3,
    question: "How are maintenance requests managed?",
    answer: "Maintenance requests are easily submitted through our resident portal app. Emergency issues are handled 24/7, while routine requests are typically resolved within 48 hours by our certified teams.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 4,
    question: "Any penalty for early lease termination?",
    answer: "Early termination policies are clearly outlined in the lease agreement. Generally, it requires a 60-day notice and a termination fee equal to two months' rent, though exceptions may apply for specific circumstances.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: 5,
    question: "Who handles lawn and maintenance work?",
    answer: "For single-family homes, tenants are usually responsible for basic lawn care unless otherwise specified. For townhomes and apartments, our dedicated HOA and community management teams handle all exterior maintenance.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400"
  }
];

export default function FAQAccordion() {
  const [activeId, setActiveId] = useState<number>(1);

  return (
    <section className="py-24 px-6 bg-[#F6F6F4]">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Section Badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 text-white text-sm font-medium mb-8">
          <MessageCircle size={16} className="text-[#FFDE02]" />
          <span>FAQ & Get Answer</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#FFDE02] ml-1" />
        </div>

        {/* Heading */}
        <BlurReveal as="h2" className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-12 text-center">
          Get every answer here
        </BlurReveal>

        {/* Accordion List */}
        <div className="w-full flex flex-col gap-4">
          <LayoutGroup>
            {faqs.map((faq) => {
              const isActive = activeId === faq.id;

              return (
                <motion.div
                  key={faq.id}
                  layout
                  onClick={() => setActiveId(faq.id)}
                  className={`cursor-pointer overflow-hidden border border-black/5 rounded-3xl transition-colors duration-500 ease-in-out ${
                    isActive ? "bg-[#FFDE02]" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                    {/* Active State Left Side (Image) */}
                    <AnimatePresence mode="popLayout">
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, width: 0, scale: 0.9 }}
                          animate={{ opacity: 1, width: "35%", scale: 1 }}
                          exit={{ opacity: 0, width: 0, scale: 0.9 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                          className="hidden md:block shrink-0"
                        >
                          <div className="w-full aspect-[4/3] rounded-xl overflow-hidden shadow-inner">
                            <img 
                              src={faq.image} 
                              alt="FAQ visual context" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Right Side / Default view */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center justify-between">
                        <motion.h3 
                          layout="position"
                          className={`text-xl md:text-2xl font-bold ${isActive ? "text-neutral-900" : "text-neutral-700"}`}
                        >
                          {faq.question}
                        </motion.h3>
                        
                        <div className="shrink-0 ml-4">
                          {isActive ? (
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-neutral-900 shadow-sm">
                              <Minus size={20} />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-neutral-500">
                              <Plus size={20} />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Answer Dropdown */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <p className="text-neutral-800 leading-relaxed max-w-xl text-lg">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </LayoutGroup>
        </div>
      </div>
    </section>
  );
}
