import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Mail, Instagram, Facebook, MapPin, Users, Calendar, Heart } from "lucide-react";

const committee = [
  { role: "President", name: "Aziza K.", color: "bg-primary" },
  { role: "Vice President", name: "Bobur T.", color: "bg-secondary" },
  { role: "Treasurer", name: "Dilnoza M.", color: "bg-accent" },
  { role: "Events Officer", name: "Jasur R.", color: "bg-coral" },
  { role: "Social Media", name: "Kamila S.", color: "bg-secondary" },
  { role: "Cultural Officer", name: "Rustam B.", color: "bg-primary" },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section - Architecture Theme */}
      <section className="relative bg-primary overflow-hidden py-16 md:py-24">
        {/* Animated decorative elements - simplified */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Dome shapes */}
          <div className="absolute -top-12 md:-top-20 right-[10%] md:right-[15%] w-24 md:w-40 h-24 md:h-40 rounded-full border-[3px] md:border-[4px] border-primary-foreground/20 animate-spin-slow" style={{ animationDuration: '30s' }} />
          
          {/* Spinning star pattern */}
          <div className="absolute top-16 md:top-20 right-[25%] md:right-[30%] animate-spin-slow hidden sm:block" style={{ animationDuration: '15s' }}>
            <div className="relative w-8 h-8 md:w-12 md:h-12">
              <div className="absolute inset-0 border-[2px] border-primary-foreground/30 rotate-0" />
              <div className="absolute inset-0 border-[2px] border-primary-foreground/30 rotate-45" />
            </div>
          </div>
          
          {/* Floating community icon */}
          <div className="absolute bottom-16 md:bottom-24 right-[8%] md:right-[20%] animate-float">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-secondary border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))]">
              <span className="flex items-center justify-center h-full text-lg md:text-2xl">🤝</span>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="neo-badge bg-secondary text-secondary-foreground mb-4 inline-block text-sm">
              <Heart className="h-3 w-3 inline mr-1" />
              Est. 2025
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-primary-foreground mb-4 md:mb-6">
              Our <span className="text-primary-foreground/60">Mehmonxona</span>
            </h1>
            <p className="font-body text-base md:text-xl text-primary-foreground/90 max-w-xl">
              The Silk Road once connected East and West; now Mehmonxona connects Uzbek hearts in Birmingham — sharing plov nights, playing sports together, exploring new places, and making memories as one family.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 md:mb-6">Our Mission : A Piece of Home on Campus</h2>
              <p className="font-body text-base md:text-lg text-muted-foreground mb-4">
                Miss the food? Miss the jokes? Miss the language? UzbekSoc is here to bring a piece of Uzbekistan to Birmingham.
              </p>
              <p className="font-body text-base md:text-lg text-muted-foreground mb-4">
                Our mission is to provide a break from the stress of exams and essays by bringing us together for the things that matter: good food, good conversation (gurung) and great company. We are here to keep our culture alive in our daily lives and to make sure you always have a place where you belong.
              </p>
              <p className="font-body text-base md:text-lg text-muted-foreground">
                One place where you don't have to explain your culture - you just live it.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="neo-card bg-secondary p-4 md:p-6 text-center">
                <Users className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 md:mb-3" />
                <div className="font-display text-2xl md:text-3xl font-bold">70+</div>
                <div className="font-body text-xs md:text-sm">Active Members</div>
              </div>
              <div className="neo-card bg-accent p-4 md:p-6 text-center">
                <Calendar className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 md:mb-3" />
                <div className="font-display text-2xl md:text-3xl font-bold">15+</div>
                <div className="font-body text-xs md:text-sm">Events per Year</div>
              </div>
              <div className="neo-card bg-coral p-4 md:p-6 text-center">
                <Heart className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 md:mb-3" />
                <div className="font-display text-2xl md:text-3xl font-bold">1+</div>
                <div className="font-body text-xs md:text-sm">Years of Community</div>
              </div>
              <div className="neo-card bg-primary p-4 md:p-6 text-center">
                <MapPin className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 md:mb-3 text-primary-foreground" />
                <div className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">1</div>
                <div className="font-body text-xs md:text-sm text-primary-foreground/80">Big Family</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-12 md:py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center">What We Do</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            <div className="neo-card bg-card p-6 md:p-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-secondary border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] mb-4 md:mb-6 flex items-center justify-center">
                <span className="text-2xl md:text-3xl">🎉</span>
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold mb-2 md:mb-3">Celebrate Culture</h3>
              <p className="font-body text-sm md:text-base text-muted-foreground">
                Whether it's dancing at Navruz or reflecting on Independence Day, we celebrate Uzbek identity together - with food made by loving hands, music from our heritage and traditions we're proud to share.
              </p>
            </div>
            <div className="neo-card bg-card p-6 md:p-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-accent border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] mb-4 md:mb-6 flex items-center justify-center">
                <span className="text-2xl md:text-3xl">🍚</span>
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold mb-2 md:mb-3">Share Moments</h3>
              <p className="font-body text-sm md:text-base text-muted-foreground">
                Traveling the UK side by side, hosting parties that feel like family reunions - we're united through the memories we build together.
              </p>
            </div>
            <div className="neo-card bg-card p-6 md:p-8 sm:col-span-2 md:col-span-1">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-coral border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] mb-4 md:mb-6 flex items-center justify-center">
                <span className="text-2xl md:text-3xl">📚</span>
              </div>
              <h3 className="font-display text-lg md:text-xl font-bold mb-2 md:mb-3">Play Together</h3>
              <p className="font-body text-sm md:text-base text-muted-foreground">
                Stay active with us through weekly sports gatherings - badminton, football, tennis, you name it. Need teammates? Count on us, we've got the players and the energy!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Committee Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl font-bold mb-4 text-center">Meet the Committee</h2>
          <p className="font-body text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            The passionate students making UzbekSoc a home away from home.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {committee.map((member) => (
              <div key={member.role} className="neo-card bg-card overflow-hidden text-center">
                <div className={`${member.color} aspect-square flex items-center justify-center border-b-[3px] border-foreground`}>
                  <span className="text-4xl">👤</span>
                </div>
                <div className="p-4">
                  <div className="font-display font-bold">{member.name}</div>
                  <div className="font-body text-sm text-muted-foreground">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-4xl font-bold mb-6">Join Our Community</h2>
            <p className="font-body text-lg text-secondary-foreground/80 mb-8">
              Becoming a member is easy and free! Get access to all our events, exclusive socials, and become part of our amazing community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="xl" variant="default">
                Join via Guild Website
              </Button>
              <Button size="xl" variant="outline">
                Contact Us
              </Button>
            </div>

            {/* Contact Info */}
            <div className="neo-card bg-card p-8">
              <h3 className="font-display text-xl font-bold mb-6">Get in Touch</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                <a
                  href="mailto:uzbeksociety@guild.bham.ac.uk"
                  className="flex flex-col items-center gap-2 hover:text-primary transition-colors"
                >
                  <div className="w-12 h-12 bg-primary border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-body text-sm">Email Us</span>
                </a>
                <a
                  href="https://instagram.com/uzsocuob"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 hover:text-primary transition-colors"
                >
                  <div className="w-12 h-12 bg-coral border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] flex items-center justify-center">
                    <Instagram className="h-5 w-5 text-coral-foreground" />
                  </div>
                  <span className="font-body text-sm">@uzsocuob</span>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 hover:text-primary transition-colors"
                >
                  <div className="w-12 h-12 bg-accent border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] flex items-center justify-center">
                    <Facebook className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <span className="font-body text-sm">Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
