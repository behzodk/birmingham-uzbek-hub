import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

const upcomingEvents = [
  {
    id: 1,
    title: "Navruz Celebration 2026",
    date: "March 21, 2026",
    location: "Great Hall, UoB",
    description: "Celebrate the Persian New Year with traditional Uzbek food, music, and dancing!",
    color: "bg-secondary",
  },
  {
    id: 2,
    title: "Plov Night",
    date: "February 15, 2026",
    location: "Student Hub",
    description: "Join us for a cozy evening of delicious plov and great conversations.",
    color: "bg-accent",
  },
  {
    id: 3,
    title: "Cultural Movie Night",
    date: "January 25, 2026",
    location: "Lecture Theatre A",
    description: "Watch classic Uzbek cinema with English subtitles and snacks!",
    color: "bg-coral",
  },
];

export function FeaturedEvents() {
  return (
    <section className="py-12 md:py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-12">
          <div>
            <span className="neo-badge bg-primary text-primary-foreground mb-3 md:mb-4 inline-block text-sm">What's Happening</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold">Upcoming Events</h2>
          </div>
          <Link to="/events" className="w-full sm:w-auto">
            <Button variant="outline" size="default" className="w-full sm:w-auto">
              View All Events
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {upcomingEvents.map((event, index) => (
            <div
              key={event.id}
              className="neo-card bg-card overflow-hidden group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`${event.color} p-3 md:p-4 border-b-[3px] border-foreground`}>
                <span className="font-display font-bold text-base md:text-lg">{event.title}</span>
              </div>
              <div className="p-4 md:p-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span className="font-body text-xs md:text-sm">{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mb-3 md:mb-4">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="font-body text-xs md:text-sm">{event.location}</span>
                </div>
                <p className="font-body text-sm md:text-base text-foreground/80 mb-3 md:mb-4">{event.description}</p>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-muted transition-colors">
                  Learn More
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
