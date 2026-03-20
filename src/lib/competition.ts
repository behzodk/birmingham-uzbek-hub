import { format, isSameDay, isValid, parseISO } from "date-fns";
import type {
  Competition,
  CompetitionEntry,
  CompetitionEntryRating,
  CompetitionLeaderboardEntry,
  CompetitionLeaderboardSettings,
  CompetitionRatingCriterion,
  CompetitionScaleType,
  CompetitionScoreMap,
  CompetitionScoringMethod,
  CompetitionVoterValidationSettings,
} from "@/types/competition";

const KNOWN_RATING_ERRORS = [
  "Email is required to submit a rating.",
  "This email has already rated this entry.",
  "This email is not eligible to vote for this competition.",
  "Invalid competition entry.",
  "Rating entry and competition do not match.",
] as const;

const DEFAULT_RESULT_MAX = 100;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const roundScore = (value: number, precision = 2) => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const asString = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback);

const asNullableString = (value: unknown) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const asNumber = (value: unknown, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
};

const asInteger = (value: unknown, fallback = 0) => Math.round(asNumber(value, fallback));

const asIdentifier = (value: unknown) => {
  if (typeof value === "number" || typeof value === "string") return value;
  return "";
};

const asNullableIdentifier = (value: unknown) => {
  if (typeof value === "number" || typeof value === "string") return value;
  return null;
};

const asBoolean = (value: unknown, fallback = false) => {
  if (typeof value === "boolean") return value;
  return fallback;
};

const asScaleType = (value: unknown): CompetitionScaleType => {
  return value === "numeric" ? "numeric" : "stars";
};

const asScoringMethod = (value: unknown): CompetitionScoringMethod => {
  return value === "behzod_formula" ? "behzod_formula" : "average";
};

const asScoreMap = (value: unknown): CompetitionScoreMap => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.entries(value).reduce<CompetitionScoreMap>((accumulator, [key, score]) => {
    const parsed = asNumber(score, Number.NaN);
    if (Number.isFinite(parsed)) {
      accumulator[key] = parsed;
    }
    return accumulator;
  }, {});
};

export const normalizeCompetitionRatingCriteria = (value: unknown): CompetitionRatingCriterion[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;

      const criterion = item as Record<string, unknown>;
      const scaleMin = asNumber(criterion.scale_min, 1);
      const scaleMax = Math.max(asNumber(criterion.scale_max, 5), scaleMin);

      return {
        id: asString(criterion.id, `criterion-${index + 1}`),
        label: asString(criterion.label, `Criterion ${index + 1}`),
        description: asString(criterion.description),
        scaleType: asScaleType(criterion.scale_type),
        scaleMin,
        scaleMax,
        weightPercentage: Math.max(asNumber(criterion.weight_percentage, 0), 0),
      };
    })
    .filter((criterion): criterion is CompetitionRatingCriterion => Boolean(criterion));
};

export const normalizeCompetitionLeaderboardSettings = (value: unknown): CompetitionLeaderboardSettings => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      resultMax: DEFAULT_RESULT_MAX,
      scoringMethod: "average",
      minimumRatingsThreshold: 1,
    };
  }

  const settings = value as Record<string, unknown>;

  return {
    resultMax: Math.max(asNumber(settings.result_max, DEFAULT_RESULT_MAX), 1),
    scoringMethod: asScoringMethod(settings.scoring_method),
    minimumRatingsThreshold: Math.max(asInteger(settings.minimum_ratings_threshold, 1), 0),
  };
};

export const normalizeCompetitionVoterValidationSettings = (
  value: unknown
): CompetitionVoterValidationSettings => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      ratingIdentityField: "guest_email",
      eligibilityFormId: null,
      eligibilityFormFieldKey: null,
    };
  }

  const settings = value as Record<string, unknown>;

  return {
    ratingIdentityField: asString(settings.rating_identity_field, "guest_email"),
    eligibilityFormId: asNullableIdentifier(settings.eligibility_form_id),
    eligibilityFormFieldKey: asNullableString(settings.eligibility_form_field_key),
  };
};

export const normalizeCompetition = (row: Record<string, unknown>): Competition => ({
  id: asIdentifier(row.id),
  title: asString(row.title, "Competition"),
  description: asNullableString(row.description),
  slug: asString(row.slug),
  contentHtml: asNullableString(row.content_html),
  location: asNullableString(row.location),
  startDate: asNullableString(row.start_date),
  endDate: asNullableString(row.end_date),
  registrationDeadline: asNullableString(row.registration_deadline),
  capacity: row.capacity === null || row.capacity === undefined ? null : asNumber(row.capacity, 0),
  prize: asNullableString(row.prize),
  featuredImage: asNullableString(row.featured_image),
  entryLabel: asNullableString(row.entry_label),
  ratingCriteria: normalizeCompetitionRatingCriteria(row.rating_criteria),
  leaderboardSettings: normalizeCompetitionLeaderboardSettings(row.leaderboard_settings),
  voterValidationSettings: normalizeCompetitionVoterValidationSettings(row.voter_validation_settings),
  status: asString(row.status),
  visibility: asString(row.visibility),
  isFeatured: asBoolean(row.is_featured),
  createdAt: asString(row.created_at),
  updatedAt: asString(row.updated_at),
});

export const normalizeCompetitionEntry = (row: Record<string, unknown>): CompetitionEntry => ({
  id: asIdentifier(row.id),
  competitionId: asIdentifier(row.competition_id),
  competitorName: asString(row.competitor_name, "Competitor"),
  competitorEmail: asNullableString(row.competitor_email),
  competitorPhone: asNullableString(row.competitor_phone),
  entryName: asString(row.entry_name),
  entryDescription: asNullableString(row.entry_description),
  entryImage: asNullableString(row.entry_image),
  entryImagePath: asNullableString(row.entry_image_path),
  ratingPublicId: asString(row.rating_public_id),
  status: asString(row.status),
  createdAt: asString(row.created_at),
  updatedAt: asString(row.updated_at),
});

export const normalizeCompetitionEntryRating = (row: Record<string, unknown>): CompetitionEntryRating => ({
  id: asIdentifier(row.id),
  entryId: asIdentifier(row.entry_id),
  competitionId: asIdentifier(row.competition_id),
  guestName: asNullableString(row.guest_name),
  guestEmail: asString(row.guest_email).trim().toLowerCase(),
  voterIdentity: asNullableString(row.voter_identity),
  scores: asScoreMap(row.scores),
  totalScore: asNumber(row.total_score, 0),
  notes: asNullableString(row.notes),
  createdAt: asString(row.created_at),
});

export const normalizeCompetitionRatingEmail = (value: string) => value.trim().toLowerCase();

export const getCompetitionEntryLabel = (competition: Competition) => competition.entryLabel?.trim() || "Item";

export const getCompetitionEntryTitle = (entry: CompetitionEntry) => {
  const entryName = entry.entryName.trim();
  if (entryName.length > 0) return entryName;

  const competitorName = entry.competitorName.trim();
  if (competitorName.length > 0) return competitorName;

  return "Competition Item";
};

const formatReadableList = (values: string[]) => {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, and ${values[values.length - 1]}`;
};

export const getCompetitionCriteriaSummary = (criteria: CompetitionRatingCriterion[]) => {
  const labels = criteria
    .map((criterion) => criterion.label.trim())
    .filter((label) => label.length > 0)
    .slice(0, 3)
    .map((label) => label.toLowerCase());

  if (labels.length === 0) return null;

  return `Rate ${formatReadableList(labels)}.`;
};

const parseDate = (value: string | null) => {
  if (!value) return null;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : null;
};

const hasTimeComponent = (value: string | null) => Boolean(value && /T\d{2}:\d{2}/.test(value));

export const formatCompetitionDateRange = (startDate: string | null, endDate: string | null) => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  if (!start && !end) return "Dates to be announced";
  if (start && !end) {
    return hasTimeComponent(startDate) ? format(start, "MMMM d, yyyy 'at' h:mm a") : format(start, "MMMM d, yyyy");
  }
  if (!start && end) {
    return hasTimeComponent(endDate) ? format(end, "MMMM d, yyyy 'at' h:mm a") : format(end, "MMMM d, yyyy");
  }

  if (start && end && isSameDay(start, end)) {
    if (hasTimeComponent(startDate) || hasTimeComponent(endDate)) {
      return `${format(start, "MMMM d, yyyy")} · ${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
    }

    return format(start, "MMMM d, yyyy");
  }

  if (start && end) {
    return `${format(start, "MMMM d, yyyy")} - ${format(end, "MMMM d, yyyy")}`;
  }

  return "Dates to be announced";
};

export const formatCompetitionDeadline = (value: string | null) => {
  const parsed = parseDate(value);
  if (!parsed) return "Deadline to be announced";
  return hasTimeComponent(value) ? format(parsed, "MMMM d, yyyy 'at' h:mm a") : format(parsed, "MMMM d, yyyy");
};

export const formatCompetitionScore = (value: number, resultMax: number) => `${roundScore(value, 1)} / ${resultMax}`;

export const calculateCompetitionAverageAcrossRatedEntries = (entryAverageScores: number[]) => {
  if (entryAverageScores.length === 0) return 0;

  return entryAverageScores.reduce((sum, score) => sum + score, 0) / entryAverageScores.length;
};

export const calculateBehzodAdjustedScore = ({
  entryAverageScore,
  ratingCount,
  competitionAverageScore,
  minimumRatingsThreshold,
}: {
  entryAverageScore: number;
  ratingCount: number;
  competitionAverageScore: number;
  minimumRatingsThreshold: number;
}) => {
  if (ratingCount <= 0) return 0;

  const v = Math.max(ratingCount, 0);
  const m = Math.max(minimumRatingsThreshold, 0);
  const denominator = v + m;

  if (denominator === 0) return entryAverageScore;

  return ((v / denominator) * entryAverageScore) + ((m / denominator) * competitionAverageScore);
};

export const computeWeightedTotalScore = (
  criteria: CompetitionRatingCriterion[],
  scores: CompetitionScoreMap,
  resultMax: number
) => {
  if (criteria.length === 0) return 0;

  const totalWeight = criteria.reduce((sum, criterion) => sum + Math.max(criterion.weightPercentage, 0), 0);
  const defaultWeight = 1 / criteria.length;

  const normalizedTotal = criteria.reduce((sum, criterion) => {
    const score = scores[criterion.id];
    if (typeof score !== "number" || Number.isNaN(score)) return sum;

    const min = criterion.scaleMin;
    const max = criterion.scaleMax;
    const safeMax = max > min ? max : min + 1;
    const normalized = clamp(score, min, max) - min;
    const range = safeMax - min;
    const criterionWeight = totalWeight > 0 ? Math.max(criterion.weightPercentage, 0) / totalWeight : defaultWeight;

    return sum + (normalized / range) * criterionWeight;
  }, 0);

  return roundScore(normalizedTotal * resultMax);
};

export const areAllCriteriaRated = (criteria: CompetitionRatingCriterion[], scores: CompetitionScoreMap) =>
  criteria.every((criterion) => typeof scores[criterion.id] === "number" && !Number.isNaN(scores[criterion.id]));

export const getConfiguredPublicSiteUrl = () => {
  const configuredUrl = import.meta.env.NEXT_PUBLIC_SITE_URL;

  if (typeof configuredUrl === "string" && configuredUrl.trim().length > 0) {
    return stripTrailingSlash(configuredUrl.trim());
  }

  if (typeof window !== "undefined" && window.location.origin) {
    return stripTrailingSlash(window.location.origin);
  }

  const fallbackUrl = import.meta.env.VITE_SITE_URL || import.meta.env.NEXT_PUBLIC_APP_URL;
  if (typeof fallbackUrl === "string" && fallbackUrl.trim().length > 0) {
    return stripTrailingSlash(fallbackUrl.trim());
  }

  return "";
};

export const buildCompetitionRatingUrl = (ratingPublicId: string) => {
  const path = `/competitions/rate/${ratingPublicId}`;
  const siteUrl = getConfiguredPublicSiteUrl();
  return siteUrl ? `${siteUrl}${path}` : path;
};

export const buildCompetitionLeaderboard = (
  entries: CompetitionEntry[],
  ratings: CompetitionEntryRating[],
  settings: CompetitionLeaderboardSettings
) => {
  const minimumRatingsThreshold = Math.max(settings.minimumRatingsThreshold, 0);
  const entrySnapshots = entries.map((entry) => {
    const entryRatings = ratings.filter((rating) => rating.entryId === entry.id);
    const ratingCount = entryRatings.length;
    const averageTotalScore =
      ratingCount > 0
        ? entryRatings.reduce((sum, rating) => sum + rating.totalScore, 0) / ratingCount
        : 0;

    return {
      entry,
      ratingCount,
      averageTotalScore,
    };
  });

  const competitionAverageScore = calculateCompetitionAverageAcrossRatedEntries(
    entrySnapshots.filter((entry) => entry.ratingCount > 0).map((entry) => entry.averageTotalScore)
  );

  const baseEntries = entrySnapshots.map<CompetitionLeaderboardEntry>(({ entry, ratingCount, averageTotalScore }) => {
    const leaderboardScore =
      settings.scoringMethod === "behzod_formula"
        ? roundScore(
            calculateBehzodAdjustedScore({
              entryAverageScore: averageTotalScore,
              ratingCount,
              competitionAverageScore,
              minimumRatingsThreshold,
            })
          )
        : roundScore(averageTotalScore);

    const qualified = ratingCount > 0 && ratingCount >= minimumRatingsThreshold;
    const pendingRatings = qualified ? 0 : Math.max(minimumRatingsThreshold - ratingCount, 0);

    return {
      rank: null,
      entry,
      ratingCount,
      averageTotalScore: roundScore(averageTotalScore),
      leaderboardScore,
      qualified,
      pendingRatings,
    };
  });

  const sortEntries = (left: CompetitionLeaderboardEntry, right: CompetitionLeaderboardEntry) => {
    if (right.leaderboardScore !== left.leaderboardScore) {
      return right.leaderboardScore - left.leaderboardScore;
    }

    if (right.ratingCount !== left.ratingCount) {
      return right.ratingCount - left.ratingCount;
    }

    return getCompetitionEntryTitle(left.entry).localeCompare(getCompetitionEntryTitle(right.entry));
  };

  const ranked = baseEntries.filter((entry) => entry.qualified).sort(sortEntries).map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  const unranked = baseEntries.filter((entry) => !entry.qualified).sort(sortEntries);

  return [...ranked, ...unranked];
};

export const getCompetitionLeaderboardMethodDescription = (
  settings: CompetitionLeaderboardSettings,
  itemLabel = "item"
) => {
  if (settings.scoringMethod === "behzod_formula") {
    return `The confidence-adjusted formula blends a ${itemLabel}'s own average with the overall average across rated ${itemLabel}s, so small sample sizes are pulled toward the field average while larger sample sizes stay closer to that ${itemLabel}'s own score.`;
  }

  return `Leaderboard positions are based on the average total score for each ${itemLabel}.`;
};

export const getCompetitionVoteRules = (competition: Competition) => {
  const itemLabel = getCompetitionEntryLabel(competition).toLowerCase();
  const rules = [`One email can rate this ${itemLabel} only once.`];
  const settings = competition.voterValidationSettings;

  if (settings.eligibilityFormId && settings.eligibilityFormFieldKey) {
    rules.push("The email you enter must match the registration email used for this competition.");
  }

  return rules;
};

export const isCompetitionRegistrationOpen = (competition: Competition) => {
  if (competition.status !== "published" || competition.visibility !== "public") {
    return false;
  }

  if (!competition.registrationDeadline) {
    return true;
  }

  const parsedDeadline = parseDate(competition.registrationDeadline);
  if (!parsedDeadline) {
    return false;
  }

  return parsedDeadline.getTime() > Date.now();
};

export const normalizeCompetitionRatingError = (error: unknown, itemLabel = "item") => {
  const normalizedItemLabel = itemLabel.trim().toLowerCase() || "item";

  if (error && typeof error === "object") {
    const message = "message" in error ? String(error.message ?? "") : "";
    const details = "details" in error ? String(error.details ?? "") : "";
    const hint = "hint" in error ? String(error.hint ?? "") : "";
    const combined = [message, details, hint].join(" ").trim();

    const knownMessage = KNOWN_RATING_ERRORS.find((candidate) => combined.includes(candidate));
    if (knownMessage === "Email is required to submit a rating.") {
      return knownMessage;
    }
    if (knownMessage === "This email has already rated this entry.") {
      return `This email has already rated this ${normalizedItemLabel}.`;
    }
    if (knownMessage === "This email is not eligible to vote for this competition.") {
      return knownMessage;
    }
    if (knownMessage === "Invalid competition entry.") {
      return `This ${normalizedItemLabel} is not available for rating.`;
    }
    if (knownMessage === "Rating entry and competition do not match.") {
      return `This ${normalizedItemLabel} rating link does not match this competition.`;
    }

    if (combined.toLowerCase().includes("duplicate") && combined.toLowerCase().includes("entry")) {
      return `This email has already rated this ${normalizedItemLabel}.`;
    }
  }

  return "We couldn't submit your rating. Please review your details and try again.";
};
