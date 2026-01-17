import { supabase } from "@/lib/supabase";
import { format, parseISO } from "date-fns";

export interface Event {
  id: number;
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  fullDescription: string;
  capacity: string;
  category: string;
  color: string;
  featured: boolean;
  highlights?: string[];
  whatToBring?: string[];
  schedule?: { time: string; activity: string }[];
}

interface DbEvent {
  id: number;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  capacity: string;
  status: string;
  featured_image: string;
  slug: string;
  content_html: string;
  highlights: string[];
  what_to_bring: string[];
  schedule: { time: string; title: string; description?: string }[];
  event_type: string;
  is_featured: boolean;
}

const getColorForCategory = (category: string): string => {
  const lower = category.toLowerCase();
  if (lower.includes('social') || lower.includes('party')) return 'bg-secondary';
  if (lower.includes('workshop') || lower.includes('learn')) return 'bg-primary';
  if (lower.includes('culture') || lower.includes('movie') || lower.includes('arts')) return 'bg-accent';
  if (lower.includes('food') || lower.includes('dinner') || lower.includes('plov')) return 'bg-coral';
  return 'bg-muted';
};

const mapDbEventToEvent = (dbEvent: DbEvent): Event => {
  const startDate = parseISO(dbEvent.start_date);
  const endDate = parseISO(dbEvent.end_date);

  const dateStr = format(startDate, 'MMMM d, yyyy');
  const startTimeStr = format(startDate, 'h:mm a');
  const endTimeStr = format(endDate, 'h:mm a');
  const timeStr = `${startTimeStr} - ${endTimeStr}`;

  return {
    id: dbEvent.id,
    slug: dbEvent.slug,
    title: dbEvent.title,
    date: dateStr,
    time: timeStr,
    location: dbEvent.location,
    description: dbEvent.description,
    fullDescription: dbEvent.content_html,
    capacity: dbEvent.capacity,
    category: dbEvent.event_type,
    color: getColorForCategory(dbEvent.event_type),
    featured: dbEvent.is_featured,
    highlights: dbEvent.highlights,
    whatToBring: dbEvent.what_to_bring,
    schedule: dbEvent.schedule?.map(s => ({
      time: s.time,
      activity: s.title // Mapping title to activity as per requirement
    })),
  };
};

export const fetchEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }

  return (data as DbEvent[]).map(mapDbEventToEvent);
};

export const fetchEventBySlug = async (slug: string): Promise<Event | null> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Error fetching event by slug:', error);
    return null;
  }

  return mapDbEventToEvent(data as DbEvent);
};
