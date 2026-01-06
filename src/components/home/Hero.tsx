import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import uzbekIkatPattern from "@/assets/uzbek-ikat-pattern.png";

// Animated geometric shapes component
function AnimatedShapes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Large spinning square - top left */}
      <div className="absolute top-[10%] left-[5%] w-16 h-16 md:w-24 md:h-24 border-[3px] border-foreground bg-secondary animate-spin-slow" 
           style={{ animationDuration: '20s' }} />
      
      {/* Bouncing diamond - top right */}
      <div className="absolute top-[15%] right-[10%] w-12 h-12 md:w-16 md:h-16 border-[3px] border-foreground bg-coral rotate-45 animate-bounce-gentle"
           style={{ animationDelay: '0.5s' }} />
      
      {/* Pulsing circle - mid left */}
      <div className="absolute top-[40%] left-[8%] w-10 h-10 md:w-14 md:h-14 border-[3px] border-foreground bg-accent rounded-full animate-pulse-scale" />
      
      {/* Floating squares cluster - right side */}
      <div className="absolute top-[30%] right-[5%] flex flex-col gap-2">
        <div className="w-8 h-8 md:w-12 md:h-12 border-[3px] border-foreground bg-primary animate-float" />
        <div className="w-6 h-6 md:w-8 md:h-8 border-[2px] border-foreground bg-secondary animate-float ml-4" style={{ animationDelay: '0.3s' }} />
        <div className="w-4 h-4 md:w-6 md:h-6 border-[2px] border-foreground bg-accent animate-float" style={{ animationDelay: '0.6s' }} />
      </div>
      
      {/* Rotating ikat square - bottom left */}
      <div className="absolute bottom-[20%] left-[10%] w-20 h-20 md:w-28 md:h-28 border-[3px] border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] animate-spin-slow overflow-hidden hidden md:block"
           style={{ animationDuration: '25s', animationDirection: 'reverse' }}>
        <img src={uzbekIkatPattern} alt="" className="w-full h-full object-cover" />
      </div>
      
      {/* Sliding horizontal bars - bottom */}
      <div className="absolute bottom-[10%] left-0 w-full hidden lg:block">
        <div className="flex gap-4 animate-slide-left">
          <div className="h-4 w-24 bg-secondary border-[2px] border-foreground" />
          <div className="h-4 w-16 bg-coral border-[2px] border-foreground" />
          <div className="h-4 w-32 bg-accent border-[2px] border-foreground" />
          <div className="h-4 w-20 bg-primary border-[2px] border-foreground" />
          <div className="h-4 w-28 bg-secondary border-[2px] border-foreground" />
        </div>
      </div>
      
      {/* Orbiting squares around center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] hidden xl:block">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 border-[2px] border-foreground bg-accent animate-orbit" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 border-[2px] border-foreground bg-coral animate-orbit" style={{ animationDelay: '-5s' }} />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 border-[2px] border-foreground bg-secondary animate-orbit" style={{ animationDelay: '-2.5s' }} />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-7 h-7 border-[2px] border-foreground bg-primary animate-orbit" style={{ animationDelay: '-7.5s' }} />
      </div>
      
      {/* Scattered small shapes */}
      <div className="absolute top-[60%] right-[15%] w-5 h-5 border-[2px] border-foreground bg-coral rotate-12 animate-wiggle" />
      <div className="absolute top-[25%] left-[25%] w-6 h-6 border-[2px] border-foreground bg-accent -rotate-12 animate-wiggle" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-[35%] right-[25%] w-4 h-4 border-[2px] border-foreground bg-secondary rotate-45 animate-wiggle" style={{ animationDelay: '1s' }} />
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Uzbek Ikat Pattern Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url(${uzbekIkatPattern})`,
            backgroundSize: '400px',
            backgroundRepeat: 'repeat',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
      </div>

      {/* Large Decorative Ikat Strip - Left */}
      <div className="absolute left-0 top-0 h-full w-20 md:w-28 lg:w-36 hidden md:block border-r-[3px] border-foreground overflow-hidden">
        <img src={uzbekIkatPattern} alt="" className="h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/50" />
      </div>

      {/* Large Decorative Ikat Strip - Right */}
      <div className="absolute right-0 top-0 h-full w-20 md:w-28 lg:w-36 hidden md:block border-l-[3px] border-foreground overflow-hidden">
        <img src={uzbekIkatPattern} alt="" className="h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/50" />
      </div>

      {/* Animated Geometric Shapes */}
      <AnimatedShapes />

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
