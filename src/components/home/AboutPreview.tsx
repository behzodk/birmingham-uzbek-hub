import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Heart, Globe, ArrowRight } from "lucide-react";

const values = [
  {
    icon: Users,
    title: "Community",
    description: "Built on shared roots",
    color: "bg-secondary",
  },
  {
    icon: Heart,
    title: "Sportsmanship",
    description: "Win or lose, together",
    color: "bg-coral",
  },
  {
    icon: Globe,
    title: "Belonging",
    description: "Feels like home, abroad",
    color: "bg-accent",
  },
];

export function AboutPreview() {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div>
            <span className="neo-badge bg-accent text-accent-foreground mb-3 md:mb-4 inline-block text-sm">Who We Are</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              More Than Just a Society
            </h2>
            <p className="font-body text-base md:text-lg text-muted-foreground mb-4 md:mb-6">
              We're a close-knit community of students supporting each other far from home. Through Zakovat nights, plov gatherings, football matches, and badminton games, we celebrate our culture and build lasting friendships. 
            </p>
            <p className="font-body text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
              We're still growing, still learning - but we always look out for one another.
            </p>
            <Link to="/about" className="w-full sm:w-auto inline-block">
              <Button size="default" className="w-full sm:w-auto">
                Meet the Committee
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Right Content - Values Cards */}
          <div className="space-y-3 md:space-y-4">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="neo-card bg-card p-4 md:p-6 flex items-start gap-3 md:gap-4"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`${value.color} p-2 md:p-3 border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] shrink-0`}>
                  <value.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg md:text-xl font-bold mb-1">{value.title}</h3>
                  <p className="font-body text-sm md:text-base text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
