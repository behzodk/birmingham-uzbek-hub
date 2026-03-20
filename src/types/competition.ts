export type CompetitionIdentifier = string | number;

export type CompetitionScaleType = "stars" | "numeric";
export type CompetitionScoringMethod = "average" | "behzod_formula";
export type CompetitionScoreMap = Record<string, number>;

export interface CompetitionRatingCriterion {
  id: string;
  label: string;
  description: string;
  scaleType: CompetitionScaleType;
  scaleMin: number;
  scaleMax: number;
  weightPercentage: number;
}

export interface CompetitionLeaderboardSettings {
  resultMax: number;
  scoringMethod: CompetitionScoringMethod;
  minimumRatingsThreshold: number;
}

export interface CompetitionVoterValidationSettings {
  ratingIdentityField: string;
  eligibilityFormId: CompetitionIdentifier | null;
  eligibilityFormFieldKey: string | null;
}

export interface Competition {
  id: CompetitionIdentifier;
  title: string;
  description: string | null;
  slug: string;
  contentHtml: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  registrationDeadline: string | null;
  capacity: number | null;
  prize: string | null;
  featuredImage: string | null;
  entryLabel: string | null;
  ratingCriteria: CompetitionRatingCriterion[];
  leaderboardSettings: CompetitionLeaderboardSettings;
  voterValidationSettings: CompetitionVoterValidationSettings;
  status: string;
  visibility: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompetitionEntry {
  id: CompetitionIdentifier;
  competitionId: CompetitionIdentifier;
  competitorName: string;
  competitorEmail: string | null;
  competitorPhone: string | null;
  entryName: string;
  entryDescription: string | null;
  entryImage: string | null;
  entryImagePath: string | null;
  ratingPublicId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompetitionEntryRating {
  id: CompetitionIdentifier;
  entryId: CompetitionIdentifier;
  competitionId: CompetitionIdentifier;
  guestName: string | null;
  guestEmail: string;
  voterIdentity: string | null;
  scores: CompetitionScoreMap;
  totalScore: number;
  notes: string | null;
  createdAt: string;
}

export interface CompetitionRatingInsert {
  entryId: CompetitionIdentifier;
  competitionId: CompetitionIdentifier;
  guestName: string | null;
  guestEmail: string;
  scores: CompetitionScoreMap;
  totalScore: number;
  notes: string | null;
}

export interface CompetitionRatingPageData {
  competition: Competition;
  entry: CompetitionEntry;
}

export interface CompetitionLeaderboardEntry {
  rank: number | null;
  entry: CompetitionEntry;
  ratingCount: number;
  averageTotalScore: number;
  leaderboardScore: number;
  qualified: boolean;
  pendingRatings: number;
}

export interface CompetitionEntryRegistrationInput {
  competitionId: CompetitionIdentifier;
  competitorName: string;
  entryName: string;
  entryDescription: string | null;
  imageFile?: File | null;
}

export interface CompetitionEntryRegistrationResult {
  entryName: string;
  ratingPublicId: string;
}
