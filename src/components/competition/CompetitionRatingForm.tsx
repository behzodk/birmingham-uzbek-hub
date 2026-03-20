import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2, ShieldCheck, Star } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import {
  computeWeightedTotalScore,
  getCompetitionEntryLabel,
  getCompetitionEntryTitle,
  getCompetitionVoteRules,
  normalizeCompetitionRatingError,
} from "@/lib/competition";
import { cn } from "@/lib/utils";
import { submitCompetitionRating } from "@/services/competitionService";
import type { Competition, CompetitionEntry, CompetitionScoreMap } from "@/types/competition";

interface CompetitionRatingFormProps {
  competition: Competition;
  entry: CompetitionEntry;
}

const STUDENT_EMAIL_DOMAIN = "@student.bham.ac.uk";
const studentUsernamePattern = /^[a-z0-9._-]+$/;

const stripStudentEmailDomain = (value: string) => {
  const trimmed = value.trim();
  const lowered = trimmed.toLowerCase();

  if (lowered.endsWith(STUDENT_EMAIL_DOMAIN)) {
    return trimmed.slice(0, trimmed.length - STUDENT_EMAIL_DOMAIN.length);
  }

  return trimmed;
};

const normalizeStudentUsername = (value: string) => stripStudentEmailDomain(value).trim().toLowerCase();
const buildStudentEmail = (value: string) => `${normalizeStudentUsername(value)}${STUDENT_EMAIL_DOMAIN}`;
const getRatingSelectionLabel = (selectedScore: number | undefined, isStarScale: boolean) => {
  if (typeof selectedScore !== "number") return "No rating yet";
  if (isStarScale) return `${selectedScore} star${selectedScore === 1 ? "" : "s"}`;
  return `${selectedScore} selected`;
};

export const CompetitionRatingForm = ({ competition, entry }: CompetitionRatingFormProps) => {
  const [guestEmailUsername, setGuestEmailUsername] = useState("");
  const [notes, setNotes] = useState("");
  const [scores, setScores] = useState<CompetitionScoreMap>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const entryLabel = getCompetitionEntryLabel(competition);
  const ratingRules = getCompetitionVoteRules(competition);
  const criteria = competition.ratingCriteria;
  const normalizedStudentUsername = normalizeStudentUsername(guestEmailUsername);
  const fullStudentEmailPreview = normalizedStudentUsername ? buildStudentEmail(guestEmailUsername) : "";

  const updateScore = (criterionId: string, value: number) => {
    setScores((current) => ({ ...current, [criterionId]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[criterionId];
      return next;
    });
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const usernameValue = stripStudentEmailDomain(guestEmailUsername);
    const normalizedUsername = normalizeStudentUsername(guestEmailUsername);

    if (!normalizedUsername) {
      nextErrors.guestEmail = "Student username is required.";
    } else if (usernameValue.includes("@")) {
      nextErrors.guestEmail = `Enter only the username before ${STUDENT_EMAIL_DOMAIN}.`;
    } else if (!studentUsernamePattern.test(normalizedUsername)) {
      nextErrors.guestEmail = "Use only letters, numbers, dots, underscores, or hyphens.";
    }

    criteria.forEach((criterion) => {
      if (typeof scores[criterion.id] !== "number") {
        nextErrors[criterion.id] = `Please score ${criterion.label.toLowerCase()}.`;
      }
    });

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (criteria.length === 0) {
      setSubmitError("This rating page is not available because the competition has no rating criteria configured.");
      return;
    }

    const nextErrors = validate();
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please complete the required rating fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      const fullGuestEmail = buildStudentEmail(guestEmailUsername);

      await submitCompetitionRating({
        entryId: entry.id,
        competitionId: competition.id,
        guestName: null,
        guestEmail: fullGuestEmail,
        scores,
        totalScore: computeWeightedTotalScore(criteria, scores, competition.leaderboardSettings.resultMax),
        notes: notes.trim() || null,
      });

      toast.success("Your rating has been submitted.");
      setIsSubmitted(true);
    } catch (error) {
      const friendlyMessage = normalizeCompetitionRatingError(error, entryLabel);
      setSubmitError(friendlyMessage);
      toast.error(friendlyMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="neo-card bg-card p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-3 text-primary">
          <CheckCircle2 className="h-8 w-8" />
          <h2 className="text-2xl font-bold sm:text-3xl">Rating Submitted</h2>
        </div>
        <p className="mb-6 font-body text-lg text-muted-foreground">
          Your vote for {getCompetitionEntryTitle(entry)} has been recorded. The database validation rules remain the
          source of truth, so any duplicate or eligibility issues would already have been surfaced here.
        </p>
        <Button variant="outline" asChild>
          <Link to={`/competitions/${competition.slug}`}>Back to Competition</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="neo-card bg-card p-4 sm:p-6">
        <h2 className="mb-4 text-2xl font-bold">Submit Your Rating</h2>
        <div className="space-y-3">
          {ratingRules.map((rule) => (
            <div key={rule} className="flex items-start gap-3 font-body text-sm text-foreground/85">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </div>

      {criteria.length === 0 ? (
        <Alert variant="destructive" className="border-[3px] border-destructive bg-background">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Rating unavailable</AlertTitle>
          <AlertDescription>
            This competition does not have public rating criteria configured, so the form cannot be submitted.
          </AlertDescription>
        </Alert>
      ) : null}

      {submitError ? (
        <Alert variant="destructive" className="border-[3px] border-destructive bg-background">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>We couldn&apos;t accept this vote</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <div className="space-y-2">
          <label htmlFor="guestEmail" className="font-display text-sm uppercase tracking-wide">
            Student Email <span className="text-destructive">*</span>
          </label>
          <div className="neo-card overflow-hidden bg-card">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-stretch">
              <Input
                id="guestEmail"
                type="text"
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                value={guestEmailUsername}
                onChange={(event) => {
                  setGuestEmailUsername(stripStudentEmailDomain(event.target.value));
                  setErrors((current) => {
                    const next = { ...current };
                    delete next.guestEmail;
                    return next;
                  });
                }}
                placeholder="username"
                className="h-14 rounded-none border-0 bg-card px-4 text-lg shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
              <div className="flex items-center border-l-[3px] border-foreground bg-muted px-3 font-body text-sm font-semibold text-muted-foreground sm:px-4 sm:text-base">
                {STUDENT_EMAIL_DOMAIN}
              </div>
            </div>
          </div>
          {errors.guestEmail ? <p className="text-sm font-medium text-destructive">{errors.guestEmail}</p> : null}
          <p className="font-body text-sm text-muted-foreground">
            Enter only your Birmingham username. We attach {STUDENT_EMAIL_DOMAIN} automatically and can only accept one
            rating per {entryLabel.toLowerCase()} from each student email.
          </p>
          {fullStudentEmailPreview ? (
            <p className="font-body text-sm text-foreground/80">
              Submitting as <span className="font-semibold">{fullStudentEmailPreview}</span>
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        {criteria.map((criterion) => {
          const selectedScore = scores[criterion.id];
          const values = Array.from(
            { length: criterion.scaleMax - criterion.scaleMin + 1 },
            (_, index) => criterion.scaleMin + index
          );
          const isStarScale = criterion.scaleType === "stars";
          const selectionLabel = getRatingSelectionLabel(selectedScore, isStarScale);

          return (
            <div key={criterion.id} className="neo-card bg-card p-4 sm:p-6">
              <div className="mb-5 border-b-[2px] border-foreground/10 pb-4">
                <p className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">Rate This</p>
                <div>
                  <h3 className="mt-2 text-2xl font-black leading-none sm:text-[2rem]">{criterion.label}</h3>
                  {criterion.description ? (
                    <p className="mt-2 max-w-2xl font-body text-sm text-muted-foreground">{criterion.description}</p>
                  ) : null}
                </div>
                <p className="mt-3 font-body text-sm text-foreground/70">
                  Scale: {criterion.scaleMin} to {criterion.scaleMax}
                </p>
              </div>

              <div className="flex flex-wrap items-start gap-3">
                <div className="flex flex-wrap gap-3">
                  {values.map((value) => {
                    const isSelected = selectedScore === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => updateScore(criterion.id, value)}
                        className={cn(
                          "neo-card flex h-16 w-16 items-center justify-center bg-card p-0 transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:h-[4.5rem] sm:w-[4.5rem]",
                          isSelected && "bg-secondary text-secondary-foreground"
                        )}
                        aria-pressed={isSelected}
                        aria-label={`${criterion.label}: ${value}`}
                      >
                        {isStarScale ? (
                          <Star
                            className={cn(
                              "h-8 w-8 text-foreground/50 sm:h-9 sm:w-9",
                              isSelected && "fill-current text-secondary-foreground"
                            )}
                          />
                        ) : (
                          <span className="font-display text-xl font-bold sm:text-2xl">{value}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="w-full rounded-md border-[2px] border-foreground/20 bg-muted px-4 py-3 text-left sm:w-auto sm:min-w-[12rem] sm:flex-1">
                  <p className="font-display text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    Current Rating
                  </p>
                  <p className="mt-1 font-body text-lg font-semibold text-foreground">{selectionLabel}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-1 font-body text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                {typeof selectedScore === "number" ? <span>Selected: {selectedScore}</span> : null}
              </div>

              {errors[criterion.id] ? <p className="mt-3 text-sm font-medium text-destructive">{errors[criterion.id]}</p> : null}
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="font-display text-sm uppercase tracking-wide">
          Notes
        </label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Optional feedback for the competitor"
          className="min-h-[120px] border-[2px] border-foreground bg-card"
        />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || criteria.length === 0}>
        {isSubmitting ? "Submitting Rating..." : `Rate This ${entryLabel}`}
      </Button>
    </form>
  );
};
