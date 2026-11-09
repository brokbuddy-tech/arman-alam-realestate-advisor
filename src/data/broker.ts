export interface BrokerProfile {
  name: string;
  role: string;
  bio: string | null;
  photoUrl: string | null;
  specializations: string[];
  languages: string[];
  yearsOfExperience: number | null;
  listingCount: number | null;
  dealCount: number | null;
  brn: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  socialLinks: {
    instagram: string | null;
    facebook: string | null;
    linkedin: string | null;
    twitter: string | null;
  };
}

export function getBrokerInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export const broker: BrokerProfile = {
  name: "Arman Alam",
  role: "Real Estate Broker",
  bio: "Explore property opportunities for sale, rent, off-plan, and commercial. Browse the listings below and get in touch to discuss a property or your requirements.",
  photoUrl: process.env.NEXT_PUBLIC_BROKER_PHOTO_URL || null,
  specializations: [],
  languages: [],
  yearsOfExperience: null,
  listingCount: null,
  dealCount: null,
  brn: null,
  website: null,
  email: null,
  phone: null,
  whatsapp: null,
  socialLinks: {
    instagram: null,
    facebook: null,
    linkedin: null,
    twitter: null,
  },
};
