"use client";

import { motion } from "framer-motion";
import { Bed, Bath, Square, Star } from "lucide-react";
import BlurReveal from "./ui/blur-reveal";

const properties = [
  {
    id: 1,
    title: "Modern Glass Villa",
    location: "Palm Jumeirah, Dubai",
    price: "$4,500,000",
    type: "Villa",
    beds: 5,
    baths: 6,
    sqft: "8,500",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Luxury Penthouse",
    location: "Downtown Dubai",
    price: "$2,200,000",
    type: "Penthouse",
    beds: 3,
    baths: 4,
    sqft: "4,200",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Serene Garden Estate",
    location: "Emirates Hills, Dubai",
    price: "$5,100,000",
    type: "Estate",
    beds: 6,
    baths: 7,
    sqft: "12,000",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    title: "Oceanfront Mansion",
    location: "Jumeirah Bay Island, Dubai",
    price: "$12,500,000",
    type: "Mansion",
    beds: 7,
    baths: 9,
    sqft: "18,000",
    rating: "5.0",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    title: "Chic Marina Apartment",
    location: "Dubai Marina",
    price: "$1,850,000",
    type: "Apartment",
    beds: 2,
    baths: 2,
    sqft: "1,600",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    title: "Desert Oasis Retreat",
    location: "Al Barari, Dubai",
    price: "$7,200,000",
    type: "Villa",
    beds: 6,
    baths: 7,
    sqft: "14,500",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=800"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function PropertyGrid() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto bg-gray-50 rounded-3xl my-10">
      <div className="flex justify-between items-end mb-12">
        <BlurReveal as="h2" className="text-4xl font-bold text-gray-900">Featured Properties</BlurReveal>
        <button className="px-6 py-2 rounded-full border border-gray-300 font-medium hover:bg-gray-100 transition-colors">
          View All
        </button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {properties.map((property) => (
          <motion.div 
            key={property.id} 
            variants={itemVariants}
            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group"
          >
            {/* Image Container with Badges */}
            <div className="relative h-64 overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url(${property.image})` }}
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-semibold text-gray-900">
                {property.price}
              </div>
              <div className="absolute top-4 right-4 bg-[#FFDF00] px-4 py-1 rounded-full text-sm font-semibold text-black">
                {property.type}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <BlurReveal as="h3" className="text-2xl font-bold text-gray-900 mb-2">{property.title}</BlurReveal>
              <p className="text-gray-500 mb-6">{property.location}</p>

              {/* Icons Row */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <Bed size={16} /> <span>{property.beds}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath size={16} /> <span>{property.baths}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square size={16} /> <span>{property.sqft} sqft</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-500 font-medium">
                  <Star size={16} fill="currentColor" /> <span>{property.rating}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
