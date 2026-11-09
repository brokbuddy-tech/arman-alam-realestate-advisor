import type { Currency } from '@/lib/currency';

export interface Property {
  id: string | number;
  title: string;
  type: string;
  price: number;
  address: string;
  location: string;
  coordinates: {
    lat: number | null;
    lng: number | null;
  };
  beds: number | null;
  baths: number | null;
  sqft: string;
  rating: number | null;
  status: string;
  permitNumber?: string | null;
  category: string;
  image: string;
  gallery: string[];
  description: string[];
  amenities: string[];
  faqs: { q: string; a: string }[];
  agent: {
    name: string;
    role: string;
    rating: number | null;
    reviews: number | null;
    image: string;
  };
  currency?: Currency;
}

export const properties: Property[] = [
  {
    id: 1,
    title: 'Dubai Creek Waterfront Flat',
    type: 'Villa',
    price: 1850,
    address: 'Tower 2, Dubai Creek Harbour, Dubai',
    location: 'Dubai Creek Harbour',
    coordinates: {
      lat: 25.2014,
      lng: 55.3512,
    },
    beds: 2,
    baths: 2,
    sqft: '1,500 sqft',
    rating: 4.8,
    status: 'Ready',
    category: 'For Rent',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    ],
    description: [
      'A serene waterfront flat located along the Dubai Creek promenade. Perfect for professionals or small families seeking tranquil canal living with direct skyline vistas.',
      'This residence features open-plan living spaces, contemporary fixtures, floor-to-ceiling glass, and sunset views over the historic creek.',
    ],
    amenities: ['Waterfront Promenade', 'Smart Home System', 'Central AC & Heating', 'Concierge Services', 'State-of-the-art Gym', 'High-speed Elevators'],
    faqs: [
      { q: "Are pets allowed?", a: "Yes, small pets are allowed with a minor pet deposit." },
      { q: "Is parking included?", a: "One covered parking spot is included in the rent." },
    ],
    agent: {
      name: 'Sarah Jenkins',
      role: 'Leasing Specialist',
      rating: 4.8,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
    }
  },
  {
    id: 2,
    title: 'Beachfront Villa Palm Jumeirah',
    type: 'Cottage',
    price: 1900,
    address: 'Frond K, Palm Jumeirah, Dubai',
    location: 'Palm Jumeirah',
    coordinates: {
      lat: 25.1235,
      lng: 55.1310,
    },
    beds: 3,
    baths: 2,
    sqft: '6,000 sqft',
    rating: 4.9,
    status: 'Ready',
    category: 'For Rent',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    ],
    description: [
      'Escape to this stunning beach villa located on Palm Jumeirah Frond K, offering private white-sand beach access and panoramic Arabian Gulf views.',
      'The property features an expansive outdoor terrace, private infinity plunge pool, and light-filled open entertaining spaces.',
    ],
    amenities: ['Private Beach Access', 'Private Swimming Pool', 'Valet Parking 24/7', 'Smart Home System', 'Central AC & Heating', 'Secure Perimeter'],
    faqs: [
      { q: "What is the minimum lease term?", a: "The minimum lease term is 12 months." },
      { q: "Does it come furnished?", a: "Yes, the villa comes fully furnished with designer coastal furniture." },
    ],
    agent: {
      name: 'Almond D. Dawson',
      role: 'Senior Principal Broker',
      rating: 4.9,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    }
  },
  {
    id: 3,
    title: 'Sky Penthouse Downtown Dubai',
    type: 'Apartment',
    price: 2000,
    address: 'Opera District, Downtown Dubai',
    location: 'Downtown Dubai',
    coordinates: {
      lat: 25.1952,
      lng: 55.2755,
    },
    beds: 3,
    baths: 3,
    sqft: '4,000 sqft',
    rating: 4.7,
    status: 'Off-Plan',
    category: 'Off-Plan',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    ],
    description: [
      'An ultra-modern architectural masterpiece currently in development right beside the Dubai Opera in Downtown. An elite off-plan investment with Burj Khalifa vistas.',
      'Enjoy bespoke Italian marble interiors, smart environmental controls, and exclusive access to a sky infinity lounge on the 54th floor.',
    ],
    amenities: ['Rooftop Infinity Pool', 'Bespoke Italian Kitchen', 'Smart Home System', 'Concierge Services', 'State-of-the-art Gym', 'High-speed Elevators'],
    faqs: [
      { q: "What is the expected handover date?", a: "The expected handover date is Q4 2026." },
      { q: "Is there a payment plan?", a: "Yes, we offer a 50/50 payment plan linked to construction milestones." },
    ],
    agent: {
      name: 'Marcus Chen',
      role: 'Investment Advisor',
      rating: 4.7,
      reviews: 56,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    }
  },
  {
    id: 4,
    title: 'One Crescent Palm Residence',
    type: 'Villa',
    price: 4495000,
    address: 'Crescent West, Palm Jumeirah, Dubai',
    location: 'Palm Jumeirah',
    coordinates: {
      lat: 25.1124,
      lng: 55.1390,
    },
    beds: 3,
    baths: 3,
    sqft: '4,500 sqft',
    rating: 4.6,
    status: 'Ready',
    category: 'For Buy',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    ],
    description: [
      'Experience ultra-luxury waterfront living at One Crescent Palm. Designed by world-renowned architects, this residence offers sweeping views of the Arabian Gulf, private elevator access, custom Italian marble flooring, and smart home automation throughout.',
      'The open-plan living and dining space flows seamlessly onto an expansive terrace equipped with a plunge pool and dining area, perfect for entertaining guests against breathtaking sunset backdrops.',
    ],
    amenities: ['Private Swimming Pool', 'Valet Parking 24/7', 'Smart Home System', 'Central AC & Heating', 'Concierge Services', 'Private Beach Access', 'State-of-the-art Gym', 'High-speed Elevators', 'Secure Perimeter'],
    faqs: [
      { q: "What is the service charge fee?", a: "The service charge is estimated at $14 per sqft annually, covering full building maintenance, security, and pool upkeep." },
      { q: "Is financing available for international buyers?", a: "Yes, partner banks offer up to 75% mortgage financing for qualified international buyers." },
      { q: "What is included in the kitchen setup?", a: "The kitchen comes fully fitted with integrated Miele appliances, custom cabinetry, and marble countertops." }
    ],
    agent: {
      name: 'Almond D. Dawson',
      role: 'Senior Principal Broker',
      rating: 4.9,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    }
  },
  {
    id: 5,
    title: 'Marina Gate Luxury Sky Residence',
    type: 'Apartment',
    price: 3250000,
    address: 'Marina Gate 2, Dubai Marina Walk, Dubai',
    location: 'Dubai Marina',
    coordinates: {
      lat: 25.0872,
      lng: 55.1455,
    },
    beds: 3,
    baths: 3,
    sqft: '2,200 sqft',
    rating: 4.9,
    status: 'Ready',
    category: 'For Buy',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    ],
    description: [
      'Panoramic yacht harbor views from every room in this high-floor Dubai Marina luxury apartment. Step right downstairs to vibrant marina dining and direct promenade access.',
      'Boasting floor-to-ceiling glass walls, premium German fittings, high ceilings, and access to infinity pools overlooking the marina.',
    ],
    amenities: ['Marina Views', 'Infinity Pool', 'Direct Promenade Access', 'Squash & Tennis Courts', 'Steam Room & Sauna', '24/7 Security'],
    faqs: [
      { q: "Is the apartment vacant on transfer?", a: "Yes, vacant and ready for immediate handover." },
      { q: "Are parking spots included?", a: "Two dedicated underground parking spaces are allocated." },
    ],
    agent: {
      name: 'Sarah Jenkins',
      role: 'Leasing & Sales Specialist',
      rating: 4.8,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
    }
  },
  {
    id: 6,
    title: 'Marasi Canal Executive Flat',
    type: 'Apartment',
    price: 2400,
    address: 'Marasi Drive, Business Bay, Dubai',
    location: 'Business Bay',
    coordinates: {
      lat: 25.1837,
      lng: 55.2666,
    },
    beds: 2,
    baths: 2,
    sqft: '1,450 sqft',
    rating: 4.7,
    status: 'Ready',
    category: 'For Rent',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    ],
    description: [
      'Perched directly along the Dubai Water Canal in Business Bay, moments from Downtown and Burj Khalifa. Features sleek minimalist design, an open-concept living zone, and sweeping skyline panoramas.',
    ],
    amenities: ['Canal Boardwalk', 'Rooftop Lounge', 'Smart Keyless Entry', 'Olympic Gym', 'Concierge & Package Delivery'],
    faqs: [
      { q: "Can I pay in multiple cheques?", a: "Yes, up to 4 cheques are accepted." },
    ],
    agent: {
      name: 'Marcus Chen',
      role: 'Investment Advisor',
      rating: 4.7,
      reviews: 56,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    }
  },
  {
    id: 7,
    title: 'Fairway Vistas Golf Estate',
    type: 'Villa',
    price: 8900000,
    address: 'Fairway Vistas, Dubai Hills Estate, Dubai',
    location: 'Dubai Hills Estate',
    coordinates: {
      lat: 25.1112,
      lng: 55.2471,
    },
    beds: 6,
    baths: 7,
    sqft: '9,800 sqft',
    rating: 5.0,
    status: 'Ready',
    category: 'For Buy',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    ],
    description: [
      'Palatial contemporary golf course mansion positioned along the 18-hole championship championship green at Dubai Hills. Extensive private landscaped grounds, infinity pool, and private cinema.',
    ],
    amenities: ['Championship Golf View', 'Private Cinema', 'Show & Prep Kitchens', 'Smart Home Integration', 'Private Swimming Pool', 'Private Staff Quarters'],
    faqs: [
      { q: "Is the golf club membership transferable?", a: "Yes, golf privileges can be linked with this title deed." },
    ],
    agent: {
      name: 'Almond D. Dawson',
      role: 'Senior Principal Broker',
      rating: 4.9,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    }
  },
  {
    id: 8,
    title: 'DIFC Gate Executive Office Suite',
    type: 'Office',
    price: 5200000,
    address: 'Gate Precinct 4, DIFC, Dubai',
    location: 'DIFC',
    coordinates: {
      lat: 25.2104,
      lng: 55.2818,
    },
    beds: 0,
    baths: 4,
    sqft: '3,800 sqft',
    rating: 4.9,
    status: 'Ready',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    ],
    description: [
      'Grade-A fitted commercial corporate headquarters located directly inside the Dubai International Financial Centre (DIFC). Featuring conference boardrooms, private executive suites, and secure high-speed telecom connectivity.',
    ],
    amenities: ['DIFC Free Zone License Eligible', 'Fitted Boardrooms', 'High-speed Fibre', '24/7 Receptionist & Security', 'VIP Parking Bays'],
    faqs: [
      { q: "Is commercial licensing support provided?", a: "Yes, our team assists with DIFC regulatory registration." },
    ],
    agent: {
      name: 'Marcus Chen',
      role: 'Investment Advisor',
      rating: 4.7,
      reviews: 56,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    }
  },
  {
    id: 9,
    title: 'Address Sky View Panoramic Residence',
    type: 'Apartment',
    price: 3850000,
    address: 'Sheikh Mohammed bin Rashid Blvd, Downtown Dubai',
    location: 'Downtown Dubai',
    coordinates: {
      lat: 25.2010,
      lng: 55.2690,
    },
    beds: 3,
    baths: 3,
    sqft: '2,400 sqft',
    rating: 4.9,
    status: 'Ready',
    category: 'For Buy',
    image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    ],
    description: [
      'Located in the iconic Address Sky View twin towers connected by the legendary Sky Bridge. Enjoy floor-to-ceiling panoramic glass windows framing the Burj Khalifa and the Dubai Fountains.',
      'Residents enjoy five-star hotel amenities, direct private air-conditioned bridge connection to Dubai Mall, infinity sky pool, and round-the-clock concierge services.',
    ],
    amenities: ['Burj Khalifa View', 'Sky Bridge Infinity Pool', 'Direct Dubai Mall Access', '24/7 Hotel Concierge', 'Valet Parking', 'Luxury Spa'],
    faqs: [
      { q: "Is the apartment serviced?", a: "Yes, optional hotel servicing and housekeeping packages are available." },
      { q: "What is the parking allocation?", a: "Two dedicated underground parking bays with valet option." },
    ],
    agent: {
      name: 'Sarah Jenkins',
      role: 'Downtown Specialist',
      rating: 4.9,
      reviews: 95,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
    }
  },
  {
    id: 10,
    title: 'Bluewaters Bay Luxury Seafront Residence',
    type: 'Apartment',
    price: 4100000,
    address: 'Promenade Level, Bluewaters Island, Dubai',
    location: 'Dubai Marina',
    coordinates: {
      lat: 25.0795,
      lng: 55.1240,
    },
    beds: 4,
    baths: 4,
    sqft: '3,100 sqft',
    rating: 4.9,
    status: 'Off-Plan',
    category: 'Off-Plan',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    ],
    description: [
      'Nestled between Bluewaters Island and The Beach at JBR, this exclusive residence delivers breathtaking Arabian Gulf sunsets and spectacular views of Ain Dubai.',
      'Features expansive open terraces, modern coastal architecture, infinity pool overlooking the sea, and direct access to beachfront walkways.',
    ],
    amenities: ['Ain Dubai View', 'Direct Beach Access', 'Infinity Seafront Pool', 'Smart Home Tech', 'Private Parking', 'Fitness Center'],
    faqs: [
      { q: "What is the completion timeline?", a: "Handover is slated for Q1 2027 with flexible payment installments." },
      { q: "Can non-UAE nationals buy here?", a: "Yes, Bluewaters offers 100% freehold ownership for foreign investors." },
    ],
    agent: {
      name: 'Almond D. Dawson',
      role: 'Senior Principal Broker',
      rating: 4.9,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    }
  }
];
