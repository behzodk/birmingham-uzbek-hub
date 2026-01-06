import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import uzbekIkatPattern from "@/assets/uzbek-ikat-pattern.png";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Uzbek Ikat Pattern Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${uzbekIkatPattern})`,
            backgroundSize: '400px',
            backgroundRepeat: 'repeat',
          }}
        />
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Large Decorative Ikat Strip - Left */}
      <div className="absolute left-0 top-0 h-full w-24 md:w-32 lg:w-40 hidden md:block border-r-[3px] border-foreground overflow-hidden">
        <img 
          src={uzbekIkatPattern} 
          alt="" 
          className="h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/50" />
      </div>

      {/* Large Decorative Ikat Strip - Right */}
      <div className="absolute right-0 top-0 h-full w-24 md:w-32 lg:w-40 hidden md:block border-l-[3px] border-foreground overflow-hidden">
        <img 
          src={uzbekIkatPattern} 
          alt="" 
          className="h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/50" />
      </div>

      {/* Floating Decorative Cards with Pattern */}
      <div className="absolute top-24 right-48 w-20 h-20 border-[3px] border-foreground shadow-[6px_6px_0px_0px_hsl(var(--foreground))] rotate-12 animate-float hidden lg:block overflow-hidden">
        <img src={uzbekIkatPattern} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute bottom-32 left-48 w-16 h-16 border-[3px] border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] -rotate-6 animate-float hidden lg:block overflow-hidden" style={{ animationDelay: '1s' }}>
        <img src={uzbekIkatPattern} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute top-48 left-1/4 w-14 h-14 bg-secondary border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] rotate-45 animate-float hidden lg:block" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-48 right-1/4 w-12 h-12 bg-accent border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] -rotate-12 animate-float hidden lg:block" style={{ animationDelay: '1.5s' }} />

      <div className="container mx-auto px-4 py-20 relative z-10">
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
