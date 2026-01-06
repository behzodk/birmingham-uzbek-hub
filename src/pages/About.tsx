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
      {/* Hero Section - Architecture/Dome Theme (Registan inspired) */}
      <section className="relative bg-primary overflow-hidden py-24">
        {/* Animated decorative elements - Islamic architecture motif */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Dome shapes */}
          <div className="absolute -top-20 right-[15%] w-40 h-40 rounded-full border-[4px] border-primary-foreground/20 animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute -top-16 right-[18%] w-32 h-32 rounded-full border-[3px] border-primary-foreground/15 animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
          
          {/* Minaret-like vertical elements */}
          <div className="absolute top-0 left-[8%] w-4 h-full bg-primary-foreground/10 hidden md:block" />
          <div className="absolute top-0 left-[10%] w-2 h-3/4 bg-primary-foreground/5 hidden md:block" />
          <div className="absolute top-0 right-[8%] w-4 h-full bg-primary-foreground/10 hidden md:block" />
          <div className="absolute top-0 right-[10%] w-2 h-3/4 bg-primary-foreground/5 hidden md:block" />
          
          {/* Floating geometric stars (Islamic pattern) */}
          <div className="absolute top-20 right-[30%] animate-spin-slow" style={{ animationDuration: '15s' }}>
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-[2px] border-primary-foreground/30 rotate-0" />
              <div className="absolute inset-0 border-[2px] border-primary-foreground/30 rotate-45" />
            </div>
          </div>
          <div className="absolute bottom-32 left-[25%] animate-spin-slow hidden lg:block" style={{ animationDuration: '20s', animationDirection: 'reverse' }}>
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-[2px] border-primary-foreground/20 rotate-0" />
              <div className="absolute inset-0 border-[2px] border-primary-foreground/20 rotate-45" />
            </div>
          </div>
          
          {/* Floating community icons */}
          <div className="absolute bottom-24 right-[12%] animate-float">
            <div className="w-14 h-14 bg-secondary border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))]">
              <span className="flex items-center justify-center h-full text-2xl">🤝</span>
            </div>
          </div>
          <div className="absolute top-36 left-[20%] animate-float hidden md:block" style={{ animationDelay: '0.7s' }}>
            <div className="w-12 h-12 bg-accent border-[3px] border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
              <span className="flex items-center justify-center h-full text-xl">🏛️</span>
            </div>
          </div>
          
          {/* Arch decoration at bottom */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-16 border-t-[3px] border-l-[3px] border-r-[3px] border-primary-foreground/20 rounded-t-full hidden md:block" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="neo-badge bg-secondary text-secondary-foreground mb-4 inline-block">
              <Heart className="h-3 w-3 inline mr-1" />
              Est. 2021
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-6">
              Our <span className="text-primary-foreground/60">Mehmonxona</span>
            </h1>
            <p className="font-body text-xl text-primary-foreground/90 max-w-xl">
              The heart of Uzbek culture at UoB. Like a guest house on the Silk Road — building bridges, creating memories, sharing traditions. 🏛️
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl font-bold mb-6">Our Mission</h2>
              <p className="font-body text-lg text-muted-foreground mb-4">
                The Uzbek Society (UzSoc) was founded in 2021 with a simple goal: to bring together students who share a connection to Uzbekistan and its rich cultural heritage.
              </p>
              <p className="font-body text-lg text-muted-foreground mb-4">
                Whether you're from Tashkent, Samarkand, or simply curious about our beautiful country, you're welcome here. We believe in celebrating our traditions while embracing the diversity of our university community.
              </p>
              <p className="font-body text-lg text-muted-foreground">
                Through events, social gatherings, and cultural activities, we aim to create a home away from home for Uzbek students and friends of Uzbekistan.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="neo-card bg-secondary p-6 text-center">
                <Users className="w-10 h-10 mx-auto mb-3" />
                <div className="font-display text-3xl font-bold">200+</div>
                <div className="font-body text-sm">Active Members</div>
              </div>
              <div className="neo-card bg-accent p-6 text-center">
                <Calendar className="w-10 h-10 mx-auto mb-3" />
                <div className="font-display text-3xl font-bold">15+</div>
                <div className="font-body text-sm">Events per Year</div>
              </div>
              <div className="neo-card bg-coral p-6 text-center">
                <Heart className="w-10 h-10 mx-auto mb-3" />
                <div className="font-display text-3xl font-bold">5</div>
                <div className="font-body text-sm">Years of Community</div>
              </div>
              <div className="neo-card bg-primary p-6 text-center">
                <MapPin className="w-10 h-10 mx-auto mb-3 text-primary-foreground" />
                <div className="font-display text-3xl font-bold text-primary-foreground">1</div>
                <div className="font-body text-sm text-primary-foreground/80">Campus Home</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl font-bold mb-12 text-center">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="neo-card bg-card p-8">
              <div className="w-16 h-16 bg-secondary border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] mb-6 flex items-center justify-center">
                <span className="text-3xl">🎉</span>
              </div>
              <h3 className="font-display text-xl font-bold mb-3">Cultural Events</h3>
              <p className="font-body text-muted-foreground">
                From Navruz celebrations to Independence Day events, we bring the spirit of Uzbekistan to Birmingham with authentic food, music, and traditions.
              </p>
            </div>
            <div className="neo-card bg-card p-8">
              <div className="w-16 h-16 bg-accent border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] mb-6 flex items-center justify-center">
                <span className="text-3xl">🍚</span>
              </div>
              <h3 className="font-display text-xl font-bold mb-3">Food & Socials</h3>
              <p className="font-body text-muted-foreground">
                Plov nights, chai gatherings, and cultural dinners. We believe that the best conversations happen over delicious food!
              </p>
            </div>
            <div className="neo-card bg-card p-8">
              <div className="w-16 h-16 bg-coral border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] mb-6 flex items-center justify-center">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="font-display text-xl font-bold mb-3">Learning & Exchange</h3>
              <p className="font-body text-muted-foreground">
                Language workshops, history talks, and cultural exchanges. Learn about Uzbekistan or share your culture with us!
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
            Our dedicated team of volunteers who work hard to make UzSoc amazing!
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
