import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import uzbekIkatPattern from "@/assets/uzbek-ikat-pattern.png";

// Animated geometric shapes component - simplified with self-rotation only
function AnimatedShapes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Top left - spinning square */}
      <div className="absolute top-[15%] left-[8%] w-12 h-12 md:w-16 md:h-16 border-[3px] border-foreground bg-secondary animate-spin-slow" 
           style={{ animationDuration: '12s' }} />
      
      {/* Top right - spinning diamond */}
      <div className="absolute top-[20%] right-[10%] w-10 h-10 md:w-14 md:h-14 border-[3px] border-foreground bg-coral rotate-45 animate-spin-slow hidden sm:block"
           style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
      
      {/* Bottom left - spinning ikat square */}
      <div className="absolute bottom-[25%] left-[12%] w-14 h-14 md:w-20 md:h-20 border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] animate-spin-slow overflow-hidden hidden md:block"
           style={{ animationDuration: '20s' }}>
        <img src={uzbekIkatPattern} alt="" className="w-full h-full object-cover" />
      </div>
      
      {/* Bottom right - spinning accent square */}
      <div className="absolute bottom-[30%] right-[8%] w-8 h-8 md:w-12 md:h-12 border-[3px] border-foreground bg-accent animate-spin-slow"
           style={{ animationDuration: '18s', animationDirection: 'reverse' }} />
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden px-4 md:px-0">
      {/* Uzbek Ikat Pattern Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url(${uzbekIkatPattern})`,
            backgroundSize: '300px',
            backgroundRepeat: 'repeat',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
      </div>

      {/* Large Decorative Ikat Strip - Left */}
      <div className="absolute left-0 top-0 h-full w-16 lg:w-28 hidden lg:block border-r-[3px] border-foreground overflow-hidden">
        <img src={uzbekIkatPattern} alt="" className="h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/50" />
      </div>

      {/* Large Decorative Ikat Strip - Right */}
      <div className="absolute right-0 top-0 h-full w-16 lg:w-28 hidden lg:block border-l-[3px] border-foreground overflow-hidden">
        <img src={uzbekIkatPattern} alt="" className="h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/50" />
      </div>

      {/* Animated Geometric Shapes */}
      <AnimatedShapes />

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 neo-badge bg-accent text-accent-foreground mb-6 md:mb-8 animate-bounce-in text-sm md:text-base">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
            <span>University of Birmingham</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-4 md:mb-6 leading-tight">
            <span className="block">Uzbek</span>
            <span className="block text-stroke text-transparent">Society</span>
          </h1>

          {/* Subheading */}
          <p className="font-body text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-xl md:max-w-2xl mx-auto mb-8 md:mb-10 px-2">
            Bringing the warmth of Uzbek culture to Birmingham. Join us for events, food, and unforgettable memories! 🇺🇿
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4 sm:px-0">
            <Link to="/events" className="w-full sm:w-auto">
              <Button size="lg" variant="default" className="w-full sm:w-auto">
                Upcoming Events
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
            <Link to="/about" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Join Our Community
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-10 md:mt-16 grid grid-cols-3 gap-2 md:gap-4 max-w-sm md:max-w-lg mx-auto">
            <div className="neo-card bg-card p-2 md:p-4">
              <div className="font-display text-xl md:text-3xl font-bold text-primary">200+</div>
              <div className="font-body text-xs md:text-sm text-muted-foreground">Members</div>
            </div>
            <div className="neo-card bg-secondary p-2 md:p-4">
              <div className="font-display text-xl md:text-3xl font-bold text-secondary-foreground">15+</div>
              <div className="font-body text-xs md:text-sm text-secondary-foreground/70">Events/Year</div>
            </div>
            <div className="neo-card bg-accent p-2 md:p-4">
              <div className="font-display text-xl md:text-3xl font-bold text-accent-foreground">5</div>
              <div className="font-body text-xs md:text-sm text-accent-foreground/70">Years Active</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
