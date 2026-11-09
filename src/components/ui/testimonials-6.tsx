import { cn } from "@/lib/utils";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Testimonial = {
  quote: string;
  image: string;
  name: string;
  role: string;
  company?: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Manzi is so polished I might just retire and become a full-time potato farmer. The ecosystem is in safe hands.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    name: "Shadcn",
    role: "Founder",
    company: "Shadcn UI",
  },
  {
    quote:
      "Manzi is why I still have hair. No more pulling it out over centering divs or fighting with CSS grid.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80",
    name: "Guillermo Rauch",
    role: "CEO",
    company: "Vercel",
  },
  {
    quote:
      "I tried to buy Manzi but they wouldn't sell. So I just bought Twitter instead to complain about it.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
    name: "Elon Musk",
    role: "CEO",
    company: "X.com",
  },
  {
    quote:
      "We just acquired Manzi for 3 gazillion dollars. We're calling it iManzi. It's our best product yet.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
    name: "Tim Cook",
    role: "CEO",
    company: "Apple",
  },
  {
    quote:
      "I'm considering shipping Manzi properties with Prime delivery. 2-day shipping on beautiful UIs? Done.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&q=80",
    name: "Jeff Bezos",
    role: "Founder",
    company: "Amazon",
  },
  {
    quote:
      "We're rewriting OpenAI's entire frontend in Manzi. The AGI told us it's the only logical choice.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80",
    name: "Sam Altman",
    role: "CEO",
    company: "OpenAI",
  },
  {
    quote:
      "We processed 100 petabytes of data to find the perfect UI library. The algorithm returned 'Manzi' with 99.9% confidence.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80",
    name: "Sundar Pichai",
    role: "CEO",
    company: "Google",
  },
  {
    quote:
      "Our links might 404 sometimes, but thanks to Manzi, at least the 404 page looks absolutely stunning.",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80",
    name: "Steven Tey",
    role: "Founder",
    company: "Dub.co",
  },
  {
    quote:
      "It's so fast, I finished my UI sprint before my next meeting even started. Open source for the win.",
    image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=256&q=80",
    name: "Peer Richelsen",
    role: "Co-Founder",
    company: "Cal.com",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export function TestimonialsSection() {
  return (
    <section className="relative py-24 bg-white border-t border-neutral-200/50">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-4 text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#111812] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#FFDE02]" />
            Testimonials
          </div>

          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
            What our clients say
          </h2>
          <p className="text-center text-neutral-500 text-sm">
            See what our customers have to say about our premium rental services.
          </p>
        </div>

        <div
          className={cn(
            "flex max-h-[600px] justify-center gap-6 overflow-hidden",
          )}
        >
          <InfiniteSlider direction="vertical" speed={30} speedOnHover={15}>
            {firstColumn.map((testimonial) => (
              <TestimonialsCard
                key={testimonial.name}
                testimonial={testimonial}
              />
            ))}
          </InfiniteSlider>
          <InfiniteSlider
            className="hidden md:flex"
            direction="vertical"
            speed={50}
            speedOnHover={25}
          >
            {secondColumn.map((testimonial) => (
              <TestimonialsCard
                key={testimonial.name}
                testimonial={testimonial}
              />
            ))}
          </InfiniteSlider>
          <InfiniteSlider
            className="hidden lg:flex"
            direction="vertical"
            speed={35}
            speedOnHover={17}
          >
            {thirdColumn.map((testimonial) => (
              <TestimonialsCard
                key={testimonial.name}
                testimonial={testimonial}
              />
            ))}
          </InfiniteSlider>
        </div>
      </div>
    </section>
  );
}

function TestimonialsCard({
  testimonial,
  className,
  ...props
}: React.ComponentProps<"figure"> & {
  testimonial: Testimonial;
}) {
  const { quote, image, name, role, company } = testimonial;
  return (
    <figure
      className={cn(
        "w-full max-w-xs rounded-3xl border border-neutral-200/60 bg-white p-8 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md",
        className,
      )}
      {...props}
    >
      <blockquote className="text-sm text-neutral-600 leading-relaxed">&quot;{quote}&quot;</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <Avatar className="size-10 rounded-full border border-neutral-100">
          <AvatarImage alt={`${name}'s profile picture`} src={image} />
          <AvatarFallback className="bg-neutral-100 text-neutral-900 font-bold">{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <cite className="font-bold text-sm not-italic leading-5 tracking-tight text-neutral-900">
            {name}
          </cite>
          <span className="text-neutral-500 text-xs leading-5 tracking-tight">
            {role} {company && `, ${company}`}
          </span>
        </div>
      </figcaption>
    </figure>
  );
}

export default TestimonialsSection;
