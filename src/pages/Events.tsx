import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "@/services/eventService";
import { buildOutlookCalendarUrl } from "@/lib/calendar";

const Events = () => {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  const featuredEvents = events.filter(e => e.featured);
  const hasEvents = events.length > 0;

  return (
    <Layout>
      {/* Hero Section - Dastarkhan Theme */}
      <section className="relative bg-accent overflow-hidden py-16 md:py-24">
        {/* Animated decorative elements - simplified */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Spinning circles */}
          <div className="absolute -top-8 -left-8 w-24 md:w-40 h-24 md:h-40 rounded-full border-[4px] md:border-[6px] border-foreground/20 animate-spin-slow" style={{ animationDuration: '30s' }} />
          <div className="absolute -bottom-10 -right-10 w-32 md:w-52 h-32 md:h-52 rounded-full border-[4px] md:border-[6px] border-foreground/20 animate-spin-slow" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
          
          {/* Floating food icon */}
          <div className="absolute top-16 md:top-20 right-[5%] md:right-[10%] animate-float">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-coral border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))]">
              <span className="flex items-center justify-center h-full text-xl md:text-2xl">🍚</span>
            </div>
          </div>
          
          {/* Decorative pattern strip */}
          <div className="absolute bottom-0 left-0 right-0 h-3 md:h-4 bg-foreground/10 flex">
            {[...Array(20)].map((_, i) => (
              <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-secondary/30' : 'bg-coral/30'}`} />
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="neo-badge bg-coral text-coral-foreground mb-4 inline-block text-sm">
              <Calendar className="h-3 w-3 inline mr-1" />
              What's On
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6">
              Gather & <span className="text-stroke text-transparent">Celebrate</span>
            </h1>
            <p className="font-body text-base md:text-xl text-accent-foreground/80 max-w-xl">
              From cultural celebrations to casual hangouts, there's always something happening at UzSoc. Join the dastarkhan! 🍽️
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="neo-card bg-card p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="neo-badge bg-coral text-coral-foreground mb-3 inline-block text-xs">Archive</span>
              <h2 className="font-display text-2xl font-bold">Looking for past events?</h2>
              <p className="font-body text-muted-foreground">
                Browse our archive by academic year and relive the highlights.
              </p>
            </div>
            <Button size="lg" asChild>
              <Link to="/events/past">View Past Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Event */}
      {featuredEvents.map(event => (
        <section key={event.id} className="py-12 bg-muted">
          <div className="container mx-auto px-4">
            <div className="neo-card bg-card overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className={`${event.color} ${event.color === "bg-primary" ? "text-white" : "text-foreground"} p-8 md:p-12 border-b-[3px] md:border-b-0 md:border-r-[3px] border-foreground`}>
                  <span className="neo-badge bg-background text-foreground mb-4 inline-block">⭐ Featured Event</span>
                  <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{event.title}</h2>
                  <div className="space-y-3 font-body">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      <span>{event.capacity}</span>
                    </div>
                  </div>
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <p className="font-body text-lg text-muted-foreground mb-6">{event.description}</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" asChild>
                      <Link to={`/events/${event.slug}`}>Register Now</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <a
                        href={buildOutlookCalendarUrl({
                          title: event.title,
                          startIso: event.startDateISO,
                          endIso: event.endDateISO,
                          location: event.location,
                          description: event.description,
                        })}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Add to Calendar
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* All Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold mb-8">All Upcoming Events</h2>
          {hasEvents ? (
            <div className="grid md:grid-cols-2 gap-6">
              {events.map((event) => (
                <div key={event.id} className="neo-card bg-card overflow-hidden">
                  <div className={`${event.color} ${event.color === "bg-primary" ? "text-white" : "text-foreground"} px-6 py-3 border-b-[3px] border-foreground flex items-center justify-between`}>
                    <span className="font-display font-bold">{event.title}</span>
                    <span className="neo-badge bg-background text-foreground text-xs">{event.category}</span>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4 font-body text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <p className="font-body text-foreground/80 mb-4">{event.description}</p>
                    <div className="flex gap-2">
                      <Button variant="default" size="sm" className="flex-1" asChild>
                        <Link to={`/events/${event.slug}`}>Register</Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/events/${event.slug}`}>Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="neo-card bg-card p-8 md:p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))]">
                <Calendar className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">No upcoming events right now</h3>
              <p className="font-body text-muted-foreground mb-6">
                We're planning the next celebration. Check back soon or browse our past events.
              </p>
              <Button asChild>
                <Link to="/events/past">View Past Events</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Events;
