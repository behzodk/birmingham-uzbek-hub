import { supabase } from "@/lib/supabase";
import {
  normalizeCompetition,
  normalizeCompetitionEntry,
  normalizeCompetitionEntryRating,
  normalizeCompetitionRatingEmail,
} from "@/lib/competition";
import type {
  Competition,
  CompetitionEntry,
  CompetitionEntryRegistrationInput,
  CompetitionEntryRegistrationResult,
  CompetitionEntryRating,
  CompetitionRatingInsert,
  CompetitionRatingPageData,
} from "@/types/competition";

const COMPETITION_SELECT = `
  id,
  title,
  description,
  slug,
  content_html,
  location,
  start_date,
  end_date,
  registration_deadline,
  capacity,
  prize,
  featured_image,
  entry_label,
  rating_criteria,
  leaderboard_settings,
  voter_validation_settings,
  status,
  visibility,
  is_featured,
  created_at,
  updated_at
`;

const ENTRY_SELECT = `
  id,
  competition_id,
  competitor_name,
  competitor_email,
  competitor_phone,
  entry_name,
  entry_description,
  entry_image,
  entry_image_path,
  rating_public_id,
  status,
  created_at,
  updated_at
`;

const RATING_SELECT = `
  id,
  entry_id,
  competition_id,
  guest_name,
  guest_email,
  voter_identity,
  scores,
  total_score,
  notes,
  created_at
`;

export const fetchPublicCompetitions = async (): Promise<Competition[]> => {
  const { data, error } = await supabase
    .from("competitions")
    .select(COMPETITION_SELECT)
    .eq("status", "published")
    .eq("visibility", "public")
    .order("is_featured", { ascending: false })
    .order("start_date", { ascending: true });

  if (error) {
    console.error("Error fetching public competitions:", error);
    throw error;
  }

  return (data ?? []).map((row) => normalizeCompetition(row));
};

export const fetchPublicCompetitionBySlug = async (slug: string): Promise<Competition | null> => {
  const { data, error } = await supabase
    .from("competitions")
    .select(COMPETITION_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .eq("visibility", "public")
    .maybeSingle();

  if (error) {
    console.error("Error fetching public competition by slug:", error);
    throw error;
  }

  return data ? normalizeCompetition(data) : null;
};

export const fetchApprovedCompetitionEntries = async (competitionId: Competition["id"]): Promise<CompetitionEntry[]> => {
  const { data, error } = await supabase
    .from("competition_entries")
    .select(ENTRY_SELECT)
    .eq("competition_id", competitionId)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching approved competition entries:", error);
    throw error;
  }

  return (data ?? []).map((row) => normalizeCompetitionEntry(row));
};

export const fetchCompetitionRatings = async (
  competitionId: Competition["id"]
): Promise<CompetitionEntryRating[]> => {
  const { data, error } = await supabase
    .from("competition_entry_ratings")
    .select(RATING_SELECT)
    .eq("competition_id", competitionId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching competition ratings:", error);
    throw error;
  }

  return (data ?? []).map((row) => normalizeCompetitionEntryRating(row));
};

export const fetchPublicCompetitionLeaderboardBySlug = async (slug: string) => {
  const competition = await fetchPublicCompetitionBySlug(slug);

  if (!competition) {
    return null;
  }

  const [entries, ratings] = await Promise.all([
    fetchApprovedCompetitionEntries(competition.id),
    fetchCompetitionRatings(competition.id),
  ]);

  return { competition, entries, ratings };
};

export const fetchPublicRatingPageData = async (ratingPublicId: string): Promise<CompetitionRatingPageData | null> => {
  const { data: entryData, error: entryError } = await supabase
    .from("competition_entries")
    .select(ENTRY_SELECT)
    .eq("rating_public_id", ratingPublicId)
    .eq("status", "approved")
    .maybeSingle();

  if (entryError) {
    console.error("Error fetching competition entry by rating public id:", entryError);
    throw entryError;
  }

  if (!entryData) return null;

  const entry = normalizeCompetitionEntry(entryData);

  const { data: competitionData, error: competitionError } = await supabase
    .from("competitions")
    .select(COMPETITION_SELECT)
    .eq("id", entry.competitionId)
    .eq("status", "published")
    .eq("visibility", "public")
    .maybeSingle();

  if (competitionError) {
    console.error("Error fetching public competition for rating page:", competitionError);
    throw competitionError;
  }

  if (!competitionData) return null;

  return {
    competition: normalizeCompetition(competitionData),
    entry,
  };
};

export const submitCompetitionRating = async (payload: CompetitionRatingInsert) => {
  const { data, error } = await supabase
    .from("competition_entry_ratings")
    .insert({
      entry_id: payload.entryId,
      competition_id: payload.competitionId,
      guest_name: payload.guestName,
      guest_email: normalizeCompetitionRatingEmail(payload.guestEmail),
      scores: payload.scores,
      total_score: payload.totalScore,
      notes: payload.notes,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error submitting competition rating:", error);
    throw error;
  }

  return data;
};

const getCompetitionImagesBucket = () =>
  import.meta.env.NEXT_PUBLIC_SUPABASE_COMPETITION_IMAGES_BUCKET || "competition-images";

const sanitizePathSegment = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "entry";

const buildCompetitionImagePath = (entryName: string, fileName: string) => {
  const extension = fileName.includes(".") ? fileName.split(".").pop()?.toLowerCase() ?? "jpg" : "jpg";
  const safeEntryName = sanitizePathSegment(entryName);
  const uniqueId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`;
  return `entries/public/${safeEntryName}-${uniqueId}.${extension}`;
};

const uploadCompetitionEntryImage = async (entryName: string, file: File) => {
  const bucket = getCompetitionImagesBucket();
  const objectPath = buildCompetitionImagePath(entryName, file.name);

  const { error: uploadError } = await supabase.storage.from(bucket).upload(objectPath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });

  if (uploadError) {
    console.error("Error uploading competition entry image:", uploadError);
    throw new Error("ENTRY_IMAGE_UPLOAD_FAILED");
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  if (!data.publicUrl) {
    throw new Error("ENTRY_IMAGE_UPLOAD_FAILED");
  }

  return {
    entryImage: data.publicUrl,
    entryImagePath: objectPath,
  };
};

export const createPublicCompetitionEntry = async (
  payload: CompetitionEntryRegistrationInput
): Promise<CompetitionEntryRegistrationResult> => {
  const trimmedEntryName = payload.entryName.trim();
  const trimmedCompetitorName = payload.competitorName.trim();

  let uploadedImage: { entryImage: string; entryImagePath: string } | null = null;

  if (payload.imageFile) {
    uploadedImage = await uploadCompetitionEntryImage(trimmedEntryName, payload.imageFile);
  }

  const { data, error } = await supabase
    .from("competition_entries")
    .insert({
      competition_id: payload.competitionId,
      competitor_name: trimmedCompetitorName,
      entry_name: trimmedEntryName,
      entry_description: payload.entryDescription,
      entry_image: uploadedImage?.entryImage ?? null,
      entry_image_path: uploadedImage?.entryImagePath ?? null,
      status: "approved",
    })
    .select("entry_name, rating_public_id")
    .single();

  if (error) {
    console.error("Error creating public competition entry:", error);
    throw new Error("ENTRY_INSERT_FAILED");
  }

  return {
    entryName: data.entry_name,
    ratingPublicId: data.rating_public_id,
  };
};

export const fetchCompetitionEntryForRegistrationSuccess = async (slug: string, ratingPublicId: string) => {
  const competition = await fetchPublicCompetitionBySlug(slug);

  if (!competition) {
    return null;
  }

  const { data, error } = await supabase
    .from("competition_entries")
    .select(ENTRY_SELECT)
    .eq("competition_id", competition.id)
    .eq("rating_public_id", ratingPublicId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching competition entry for registration success:", error);
    throw error;
  }

  if (!data) return null;

  return {
    competition,
    entry: normalizeCompetitionEntry(data),
  };
};
