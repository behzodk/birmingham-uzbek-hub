import { supabase } from "@/lib/supabase";
import { format, parseISO } from "date-fns";

export interface Event {
  id: number;
  slug: string;
  title: string;
  date: string;
  time: string;
  startDateISO: string;
  endDateISO: string;
  location: string;
  description: string;
  fullDescription: string;
  capacity: string;
  category: string;
  color: string;
  featured: boolean;
  featuredImage?: string;
  coverImage?: string;
  highlights?: string[];
  whatToBring?: string[];
  schedule?: { time: string; activity: string }[];
}

export interface EventPhotoAsset {
  id: number;
  eventId: number;
  fileName: string;
  storagePath: string;
  publicUrl: string;
  mimeType: string | null;
  fileSize: number | null;
  createdAt: string;
}

export interface EventPhotoAssetPage {
  items: EventPhotoAsset[];
  totalCount: number;
  nextOffset: number | null;
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
  cover_image?: string;
  slug: string;
  content_html: string;
  highlights: string[];
  what_to_bring: string[];
  schedule: { time: string; title: string; description?: string }[];
  event_type: string;
  is_featured: boolean;
  visibility?: string;
}

interface DbEventPhotoAsset {
  id: number;
  event_id: number;
  file_name: string;
  storage_path: string;
  public_url: string;
  mime_type: string | null;
  file_size: number | null;
  created_at: string;
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
    startDateISO: dbEvent.start_date,
    endDateISO: dbEvent.end_date,
    location: dbEvent.location,
    description: dbEvent.description,
    fullDescription: dbEvent.content_html,
    capacity: dbEvent.capacity,
    category: dbEvent.event_type,
    color: getColorForCategory(dbEvent.event_type),
    featured: dbEvent.is_featured,
    featuredImage: dbEvent.featured_image,
    coverImage: dbEvent.cover_image ?? undefined,
    highlights: dbEvent.highlights,
    whatToBring: dbEvent.what_to_bring,
    schedule: dbEvent.schedule?.map(s => ({
      time: s.time,
      activity: s.title // Mapping title to activity as per requirement
    })),
  };
};

const mapDbEventPhotoAsset = (asset: DbEventPhotoAsset): EventPhotoAsset => ({
  id: asset.id,
  eventId: asset.event_id,
  fileName: asset.file_name,
  storagePath: asset.storage_path,
  publicUrl: asset.public_url,
  mimeType: asset.mime_type,
  fileSize: asset.file_size,
  createdAt: asset.created_at,
});

export const fetchEvents = async (): Promise<Event[]> => {
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .eq('visibility', 'public')
    .gte('end_date', nowIso)
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
    .eq('visibility', 'public')
    .single();

  if (error) {
    console.error('Error fetching event by slug:', error);
    return null;
  }

  return mapDbEventToEvent(data as DbEvent);
};

export const fetchPastEvents = async (): Promise<Event[]> => {
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .eq('visibility', 'public')
    .lt('end_date', nowIso)
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Error fetching past events:', error);
    throw error;
  }

  return (data as DbEvent[]).map(mapDbEventToEvent);
};

export const fetchEventPhotoAssetCount = async (eventId: number): Promise<number> => {
  const { count, error } = await supabase
    .from("event_photo_assets")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId);

  if (error) {
    console.error("Error fetching event photo count:", error);
    throw error;
  }

  return count ?? 0;
};

export const fetchEventPhotoAssetsPage = async (
  eventId: number,
  offset = 0,
  limit = 24
): Promise<EventPhotoAssetPage> => {
  const end = offset + limit - 1;
  const { data, error, count } = await supabase
    .from("event_photo_assets")
    .select("id, event_id, file_name, storage_path, public_url, mime_type, file_size, created_at", {
      count: "exact",
    })
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })
    .range(offset, end);

  if (error) {
    console.error("Error fetching event photo assets:", error);
    throw error;
  }

  const items = (data as DbEventPhotoAsset[] | null)?.map(mapDbEventPhotoAsset) ?? [];
  const totalCount = count ?? items.length;

  return {
    items,
    totalCount,
    nextOffset: offset + items.length < totalCount ? offset + limit : null,
  };
};

export const fetchAllEventPhotoAssets = async (eventId: number): Promise<EventPhotoAsset[]> => {
  const pageSize = 100;
  let offset = 0;
  let allItems: EventPhotoAsset[] = [];

  while (true) {
    const page = await fetchEventPhotoAssetsPage(eventId, offset, pageSize);
    allItems = [...allItems, ...page.items];

    if (page.nextOffset === null) {
      return allItems;
    }

    offset = page.nextOffset;
  }
};
