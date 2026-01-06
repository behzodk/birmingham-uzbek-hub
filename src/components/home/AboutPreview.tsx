import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Heart, Globe, ArrowRight } from "lucide-react";

const values = [
  {
    icon: Users,
    title: "Community",
    description: "Building lasting friendships and connections",
    color: "bg-secondary",
  },
  {
    icon: Heart,
    title: "Culture",
    description: "Celebrating our rich Uzbek heritage",
    color: "bg-coral",
  },
  {
    icon: Globe,
    title: "Inclusion",
    description: "Welcome to everyone, from everywhere",
    color: "bg-accent",
  },
];

export function AboutPreview() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <span className="neo-badge bg-accent text-accent-foreground mb-4 inline-block">Who We Are</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              More Than Just a Society
            </h2>
            <p className="font-body text-lg text-muted-foreground mb-6">
              The Uzbek Society at UoB is a vibrant community of students who share a love for Uzbek culture, traditions, and hospitality. Whether you're from Uzbekistan or simply curious about our beautiful country, you're welcome here!
            </p>
            <p className="font-body text-lg text-muted-foreground mb-8">
              From Navruz celebrations to plov nights, language exchanges to cultural workshops – we bring the spirit of Uzbekistan to Birmingham.
            </p>
            <Link to="/about">
              <Button size="lg">
                Learn More About Us
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Right Content - Values Cards */}
          <div className="space-y-4">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="neo-card bg-card p-6 flex items-start gap-4"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`${value.color} p-3 border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))]`}>
                  <value.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold mb-1">{value.title}</h3>
                  <p className="font-body text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
