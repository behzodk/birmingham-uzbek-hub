import { supabase } from "@/lib/supabase";
import { format, parseISO } from "date-fns";

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  contentHtml?: string | null;
  author: string;
  date: string;
  category: string;
  color: string;
  featured: boolean;
  image?: string | null;
}

interface DbNews {
  id: string;
  subject: string;
  content: string;
  status: string;
  scheduled_at: string | null;
  sent_at: string | null;
  recipient_count: number;
  open_rate: number | null;
  created_at: string;
  updated_at: string;
  slug: string;
  content_html: string | null;
  featured_image: string | null;
}

const getCategoryForSubject = (subject: string): string => {
  const lower = subject.toLowerCase();
  if (lower.includes("recipe") || lower.includes("plov") || lower.includes("food")) return "Cuisine";
  if (lower.includes("recap") || lower.includes("event")) return "Event Recap";
  if (lower.includes("announce") || lower.includes("announcement") || lower.includes("update")) return "Announcement";
  if (lower.includes("culture") || lower.includes("heritage") || lower.includes("tradition")) return "Culture";
  return "Blog";
};

const getColorForCategory = (category: string): string => {
  const lower = category.toLowerCase();
  if (lower.includes("event")) return "bg-accent";
  if (lower.includes("announce") || lower.includes("blog")) return "bg-secondary";
  if (lower.includes("cuisine") || lower.includes("food")) return "bg-coral";
  if (lower.includes("culture")) return "bg-primary";
  return "bg-muted";
};

const getColorForSubject = (subject: string): string => {
  const lower = subject.toLowerCase();
  if (lower.includes("event") || lower.includes("recap")) return "bg-accent";
  if (lower.includes("announce") || lower.includes("update")) return "bg-secondary";
  if (lower.includes("food") || lower.includes("plov") || lower.includes("recipe")) return "bg-coral";
  return "bg-primary";
};

const stripHtml = (html: string) => {
  const withoutStyles = html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ");
  return withoutStyles.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

const makeExcerpt = (content: string, maxLength = 180) => {
  if (content.length <= maxLength) return content;
  return `${content.slice(0, maxLength).trim()}…`;
};

const mapDbNewsToArticle = (dbNews: DbNews, featuredSlugs: Set<string>): NewsArticle => {
  const dateStr = format(parseISO(dbNews.created_at), "MMMM d, yyyy");
  const category = getCategoryForSubject(dbNews.subject);
  const rawText = dbNews.content_html ? stripHtml(dbNews.content_html) : dbNews.content;
  return {
    id: dbNews.id,
    slug: dbNews.slug,
    title: dbNews.subject,
    excerpt: makeExcerpt(rawText),
    content: dbNews.content,
    contentHtml: dbNews.content_html,
    author: "UzSoc",
    date: dateStr,
    category,
    color: getColorForCategory(category),
    featured: featuredSlugs.has(dbNews.slug),
    image: dbNews.featured_image,
  };
};

export const fetchNews = async (): Promise<NewsArticle[]> => {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching news:", error);
    throw error;
  }

  const featuredSlugs = new Set<string>();
  if (data && data.length > 0) {
    featuredSlugs.add(data[0].slug);
  }

  return (data as DbNews[]).map((item) => mapDbNewsToArticle(item, featuredSlugs));
};

export const fetchNewsBySlug = async (slug: string): Promise<NewsArticle | null> => {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    console.error("Error fetching news by slug:", error);
    return null;
  }

  return mapDbNewsToArticle(data as DbNews, new Set([slug]));
};
