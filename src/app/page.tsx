import BrokerProfile from "@/components/BrokerProfile";
import { broker } from "@/data/broker";
import { properties } from "@/data/properties";

export default function Home() {
  return (
    <main className="min-h-screen selection:bg-[#FFDF00] selection:text-black">
      <BrokerProfile
        broker={broker}
        properties={properties.map(({ id, title, location, price, type, category, beds, baths, sqft, rating, image }) => ({
          id,
          title,
          location,
          price,
          type,
          category,
          beds,
          baths,
          sqft,
          rating,
          image,
        }))}
      />
    </main>
  );
}
