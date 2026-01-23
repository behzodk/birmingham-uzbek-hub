import { useParams, Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, MapPin, Users, CheckCircle, ListChecks } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchEventBySlug, fetchEvents } from "@/services/eventService";
import { fetchActiveFormByEventId } from "@/services/formService";
import { SEO } from "@/components/SEO";

const EventDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => fetchEventBySlug(slug!),
    enabled: !!slug
  });

  const { data: allEvents = [] } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents
  });

  const { data: activeForm } = useQuery({
    queryKey: ["event-form", event?.id],
    queryFn: () => fetchActiveFormByEventId(event!.id),
    enabled: !!event?.id
  });



  if (isLoadingEvent) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <SEO title="Event Not Found" />
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <h1 className="font-display text-4xl font-bold mb-4">Event Not Found</h1>
          <p className="font-body text-muted-foreground mb-8">The event you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/events")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </Layout>
    );
  }

  // Get other upcoming events
  const otherEvents = allEvents
    .filter(e => e.id !== event.id)
    .slice(0, 2);

  // Parse markdown-like content to JSX
  const renderContent = (content: string) => {
    if (!content) return null;
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="neo-list">
            {listItems.map((item, i) => <li key={i} className="neo-list-item">{item}</li>)}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="font-display text-2xl font-bold mt-8 mb-4">
            {trimmed.replace('## ', '')}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="font-display text-xl font-bold mt-6 mb-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      } else if (trimmed.startsWith('- ')) {
        listItems.push(trimmed.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1'));
      } else if (trimmed.match(/^\d+\./)) {
        listItems.push(trimmed.replace(/^\d+\.\s*/, ''));
      } else if (trimmed === '') {
        flushList();
      } else {
        flushList();
        const formattedText = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        elements.push(
          <p 
            key={index} 
            className="font-body text-lg text-foreground/90 mb-4 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        );
      }
    });

    flushList();
    return elements;
  };

  return (
    <Layout>
      <SEO 
        title={event.title} 
        description={event.description}
        image={event.featuredImage}
      />
      {/* Hero Section */}
      <section
        className={`relative ${event.color} ${event.color === "bg-primary" ? "text-white" : "text-foreground"} overflow-hidden py-12 md:py-20`}
        style={
          event.coverImage
            ? {
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${event.coverImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {/* Decorative spinning shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 right-[10%] w-8 h-8 md:w-12 md:h-12 border-[2px] border-foreground/20 animate-spin-slow" style={{ animationDuration: '15s' }} />
          <div className="absolute bottom-12 left-[8%] w-6 h-6 md:w-10 md:h-10 border-[2px] border-foreground/20 rotate-45 animate-spin-slow" style={{ animationDuration: '20s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Button 
            variant="ghost" 
            className="mb-6 hover:bg-background/20"
            onClick={() => navigate("/events")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>

          <div className="max-w-3xl">
            <span className="neo-badge bg-foreground text-background mb-4 inline-block">
              {event.category}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              {event.title}
            </h1>
            
            {/* Event Meta */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-body">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                <MapPin className="h-5 w-5" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{event.capacity}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                {renderContent(event.fullDescription)}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Register CTA */}
              <div className="neo-card bg-card p-6">
                <h3 className="font-display text-xl font-bold mb-4">Join This Event</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm font-body">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-body">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-body">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{event.location}</span>
                  </div>
                </div>
                {activeForm ? (
                  <Button className="w-full" size="lg" asChild>
                    <Link to={`/forms/${activeForm.slug}`}>Register Now</Link>
                  </Button>
                ) : (
                  <Button className="w-full" size="lg" disabled>
                    Registration Closed
                  </Button>
                )}
                <Button variant="outline" className="w-full mt-2">Add to Calendar</Button>
              </div>

              {/* Highlights */}
              {event.highlights && event.highlights.length > 0 && (
                <div className="neo-card bg-muted p-6">
                  <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Highlights
                  </h3>
                  <ul className="space-y-2 font-body text-sm">
                    {event.highlights.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What to Bring */}
              {event.whatToBring && event.whatToBring.length > 0 && (
                <div className="neo-card bg-muted p-6">
                  <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                    <ListChecks className="h-5 w-5 text-primary" />
                    What to Bring
                  </h3>
                  <ul className="space-y-2 font-body text-sm">
                    {event.whatToBring.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Schedule */}
              {event.schedule && event.schedule.length > 0 && (
                <div className="neo-card bg-card p-6">
                  <h3 className="font-display text-lg font-bold mb-4">Schedule</h3>
                  <div className="space-y-3">
                    {event.schedule.map((item, i) => (
                      <div key={i} className="flex gap-4 font-body text-sm">
                        <span className="font-bold text-primary whitespace-nowrap">{item.time}</span>
                        <span>{item.activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Other Events */}
      {otherEvents.length > 0 && (
        <section className="py-12 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-2xl font-bold mb-8">Other Upcoming Events</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {otherEvents.map((otherEvent) => (
                <Link 
                  key={otherEvent.id} 
                  to={`/events/${otherEvent.slug}`}
                  className="neo-card bg-card overflow-hidden group hover:translate-y-[-2px] transition-transform"
                >
                  <div className={`${otherEvent.color} ${otherEvent.color === "bg-primary" ? "text-white" : "text-foreground"} p-4 border-b-[3px] border-foreground flex justify-between items-center`}>
                    <span className="font-display font-bold">{otherEvent.title}</span>
                    <span className="neo-badge bg-background text-foreground text-xs">{otherEvent.category}</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3 font-body text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{otherEvent.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{otherEvent.time}</span>
                      </div>
                    </div>
                    <p className="font-body text-foreground/80 line-clamp-2">{otherEvent.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Events CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <Button onClick={() => navigate("/events")} size="lg">
            <ArrowLeft className="h-4 w-4 mr-2" />
            View All Events
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default EventDetail;
