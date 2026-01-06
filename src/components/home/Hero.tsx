import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center uzbek-pattern overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-24 h-24 bg-secondary border-[3px] border-foreground shadow-[6px_6px_0px_0px_hsl(var(--foreground))] rotate-12 animate-float hidden lg:block" />
      <div className="absolute bottom-20 left-10 w-16 h-16 bg-coral border-[3px] border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] -rotate-6 animate-float hidden lg:block" style={{ animationDelay: '1s' }} />
      <div className="absolute top-40 left-1/4 w-12 h-12 bg-accent border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] rotate-45 animate-float hidden lg:block" style={{ animationDelay: '0.5s' }} />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 neo-badge bg-accent text-accent-foreground mb-8 animate-bounce-in">
            <Sparkles className="h-4 w-4" />
            <span>University of Birmingham</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="block">Uzbek</span>
            <span className="block text-stroke text-transparent">Society</span>
          </h1>

          {/* Subheading */}
          <p className="font-body text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Bringing the warmth of Uzbek culture to Birmingham. Join us for events, food, and unforgettable memories! 🇺🇿
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events">
              <Button size="xl" variant="default">
                Upcoming Events
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="xl" variant="secondary">
                Join Our Community
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="neo-card bg-card p-4">
              <div className="font-display text-3xl font-bold text-primary">200+</div>
              <div className="font-body text-sm text-muted-foreground">Members</div>
            </div>
            <div className="neo-card bg-secondary p-4">
              <div className="font-display text-3xl font-bold text-secondary-foreground">15+</div>
              <div className="font-body text-sm text-secondary-foreground/70">Events/Year</div>
            </div>
            <div className="neo-card bg-accent p-4">
              <div className="font-display text-3xl font-bold text-accent-foreground">5</div>
              <div className="font-body text-sm text-accent-foreground/70">Years Active</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
