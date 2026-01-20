import { useEffect, useMemo, useState } from "react";
import { format, isWithinInterval, parseISO } from "date-fns";
import { Archive, CalendarDays, Filter, MapPin } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { fetchPastEvents } from "@/services/eventService";

const getAcademicYearLabel = (date: Date) => {
  const year = date.getFullYear();
  const startYear = date.getMonth() >= 8 ? year : year - 1;
  return `${startYear}-${startYear + 1}`;
};

const getAcademicYearRange = (label: string) => {
  const [startYear, endYear] = label.split("-").map(Number);
  return {
    start: new Date(startYear, 8, 1, 0, 0, 0),
    end: new Date(endYear, 7, 31, 23, 59, 59),
  };
};

const PastEvents = () => {
  const { data: pastEvents = [], isLoading } = useQuery({
    queryKey: ["past-events"],
    queryFn: fetchPastEvents,
  });

  const academicYears = useMemo(() => {
    const unique = new Set(
      pastEvents.map((event) =>
        getAcademicYearLabel(parseISO(event.startDateISO)),
      ),
    );
    return Array.from(unique).sort(
      (a, b) => Number(b.split("-")[0]) - Number(a.split("-")[0]),
    );
  }, [pastEvents]);

  const [selectedYear, setSelectedYear] = useState(academicYears[0] ?? "");

  useEffect(() => {
    if (!selectedYear && academicYears.length > 0) {
      setSelectedYear(academicYears[0]);
    }
  }, [academicYears, selectedYear]);

  const filteredEvents = useMemo(() => {
    if (!selectedYear) return [];
    const { start, end } = getAcademicYearRange(selectedYear);
    return pastEvents
      .filter((event) =>
        isWithinInterval(parseISO(event.startDateISO), { start, end }),
      )
      .sort(
        (a, b) =>
          parseISO(a.startDateISO).getTime() -
          parseISO(b.startDateISO).getTime(),
      );
  }, [pastEvents, selectedYear]);

  const eventDates = useMemo(
    () => filteredEvents.map((event) => parseISO(event.startDateISO)),
    [filteredEvents],
  );

  return (
    <Layout>
      <section className="relative bg-accent overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-8 -left-8 w-28 md:w-44 h-28 md:h-44 rounded-full border-[4px] md:border-[6px] border-foreground/20 animate-spin-slow" style={{ animationDuration: "32s" }} />
          <div className="absolute -bottom-10 -right-10 w-36 md:w-56 h-36 md:h-56 rounded-full border-[4px] md:border-[6px] border-foreground/20 animate-spin-slow" style={{ animationDuration: "26s", animationDirection: "reverse" }} />
          <div className="absolute top-10 md:top-16 right-[6%] md:right-[12%] animate-float">
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-coral border-[3px] border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))]">
              <span className="flex items-center justify-center h-full text-2xl md:text-3xl">🗓️</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="neo-badge bg-coral text-coral-foreground mb-4 inline-flex items-center gap-2 text-sm">
              <Archive className="h-3 w-3" />
              Past Events Archive
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6">
              Memory <span className="text-stroke text-transparent">Lane</span>
            </h1>
            <p className="font-body text-base md:text-xl text-accent-foreground/80 max-w-xl">
              Explore our highlights by academic year. Pick a year, scan the calendar, and relive the best moments.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 bg-muted">
        <div className="container mx-auto px-4">
          <div className="neo-card bg-card p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">
              <div>
                <span className="neo-badge bg-background text-foreground mb-3 inline-flex items-center gap-2">
                  <Filter className="h-3 w-3" />
                  Academic Year
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-bold">Choose your timeline</h2>
                <p className="font-body text-muted-foreground mt-2">
                  Selected year: <span className="font-bold text-foreground">{selectedYear}</span>
                </p>
              </div>
              <div className="w-full lg:w-auto">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-full lg:w-[220px] border-[3px] border-foreground font-display font-bold uppercase shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="border-[3px] border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
                    {academicYears.map((year) => (
                      <SelectItem key={year} value={year} className="font-body">
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-body text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-foreground" />
                Event day
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-accent" />
                Today
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-muted" />
                Outside range
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[2fr_1fr] gap-8 items-start">
            <div className="neo-card bg-card p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  <h3 className="font-display text-2xl font-bold">Year at a glance</h3>
                </div>
                <span className="neo-badge bg-coral text-coral-foreground text-xs">
                  {filteredEvents.length} events
                </span>
              </div>
              {isLoading ? (
                <div className="flex items-center justify-center min-h-[240px]">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
              ) : (
              <Calendar
                mode="single"
                showOutsideDays={false}
                numberOfMonths={3}
                className="w-full"
                modifiers={{ event: eventDates }}
                modifiersClassNames={{
                  event:
                    "bg-foreground text-background hover:bg-foreground hover:text-background",
                }}
                classNames={{
                  months: "flex flex-col lg:flex-row gap-6",
                  month:
                    "space-y-4 border-[3px] border-foreground p-4 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]",
                  caption_label: "text-base font-display font-bold uppercase",
                  head_cell: "text-foreground font-bold text-sm w-11",
                  row: "flex w-full mt-2 gap-1",
                  cell: "h-11 w-11 text-center text-sm p-0 relative",
                  day: "h-11 w-11 p-0 font-bold",
                }}
              />
              )}
            </div>

            <div className="space-y-6">
              <div className="neo-card bg-card p-6">
                <h3 className="font-display text-xl font-bold mb-2">Event list</h3>
                <p className="font-body text-sm text-muted-foreground">
                  Sorted chronologically for {selectedYear}.
                </p>
              </div>

              {filteredEvents.map((event) => (
                <div key={event.id} className="neo-card bg-card overflow-hidden">
                  <div className={`${event.color} px-5 py-3 border-b-[3px] border-foreground flex items-center justify-between`}>
                    <span className="font-display font-bold">{event.title}</span>
                    <span className="neo-badge bg-background text-foreground text-xs">
                      {event.category}
                    </span>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      <span>{format(parseISO(event.startDateISO), "MMMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <p className="font-body text-foreground/80">{event.description}</p>
                  </div>
                </div>
              ))}
              {filteredEvents.length === 0 && (
                <div className="neo-card bg-card p-6">
                  <p className="font-body text-muted-foreground">
                    {isLoading ? "Loading past events..." : "No events found for this academic year yet."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PastEvents;
