import { Award, BarChart3, CheckCircle2, Medal, ShieldAlert, Trophy, Users } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  buildCompetitionLeaderboard,
  calculateBehzodAdjustedScore,
  calculateCompetitionAverageAcrossRatedEntries,
  formatCompetitionScore,
  getCompetitionEntryLabel,
  getCompetitionEntryTitle,
  getCompetitionLeaderboardMethodDescription,
} from "@/lib/competition";
import type { Competition, CompetitionEntry, CompetitionEntryRating } from "@/types/competition";

interface CompetitionLeaderboardProps {
  competition: Competition;
  entries: CompetitionEntry[];
  ratings: CompetitionEntryRating[];
}

const podiumStyles = [
  "bg-secondary text-secondary-foreground",
  "bg-primary text-primary-foreground",
  "bg-accent text-accent-foreground",
];

const getStatusLabel = (ratingCount: number, pendingRatings: number, qualified: boolean) => {
  if (qualified) return "Placed";
  if (ratingCount === 0) return "Unranked: no ratings yet";
  if (pendingRatings > 0) return `Unranked: needs ${pendingRatings} more rating${pendingRatings === 1 ? "" : "s"}`;
  return "Unranked";
};

const formatDisplayedScore = (score: number, resultMax: number, ratingCount: number) => {
  if (ratingCount === 0) return "No ratings yet";
  return formatCompetitionScore(score, resultMax);
};

export const CompetitionLeaderboard = ({ competition, entries, ratings }: CompetitionLeaderboardProps) => {
  const leaderboardEntries = buildCompetitionLeaderboard(entries, ratings, competition.leaderboardSettings);
  const rankedEntries = leaderboardEntries.filter((entry) => entry.rank !== null);
  const ratedEntries = leaderboardEntries.filter((entry) => entry.ratingCount > 0);
  const entryLabel = getCompetitionEntryLabel(competition);
  const itemLabel = entryLabel.toLowerCase();
  const scoreDescription = getCompetitionLeaderboardMethodDescription(competition.leaderboardSettings, itemLabel);
  const minimumRatingsThreshold = competition.leaderboardSettings.minimumRatingsThreshold;
  const resultMax = competition.leaderboardSettings.resultMax;
  const competitionAverageScore = calculateCompetitionAverageAcrossRatedEntries(
    ratedEntries.map((entry) => entry.averageTotalScore)
  );
  const exampleCompetitionAverage = competitionAverageScore > 0 ? competitionAverageScore : resultMax * 0.92;
  const examplePerfectScore = resultMax;
  const exampleSteadyScore = resultMax * 0.96;
  const exampleQuickRatings = 6;
  const exampleSteadyRatings = 50;
  const exampleQuickAdjusted = calculateBehzodAdjustedScore({
    entryAverageScore: examplePerfectScore,
    ratingCount: exampleQuickRatings,
    competitionAverageScore: exampleCompetitionAverage,
    minimumRatingsThreshold,
  });
  const exampleSteadyAdjusted = calculateBehzodAdjustedScore({
    entryAverageScore: exampleSteadyScore,
    ratingCount: exampleSteadyRatings,
    competitionAverageScore: exampleCompetitionAverage,
    minimumRatingsThreshold,
  });

  if (entries.length === 0) {
    return (
      <div className="neo-card bg-card p-8">
        <h2 className="mb-3 text-2xl font-bold">Leaderboard Unavailable</h2>
        <p className="font-body text-muted-foreground">
          No approved {entryLabel.toLowerCase()}s are available for public ranking yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="neo-card bg-card p-5">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <BarChart3 className="h-5 w-5" />
            <span className="font-display text-sm uppercase tracking-wide">Scoring Method</span>
          </div>
          <p className="text-2xl font-bold">
            {competition.leaderboardSettings.scoringMethod === "behzod_formula" ? "Confidence-Adjusted Formula" : "Average"}
          </p>
        </div>
        <div className="neo-card bg-card p-5">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <Award className="h-5 w-5" />
            <span className="font-display text-sm uppercase tracking-wide">Result Scale</span>
          </div>
          <p className="text-2xl font-bold">{resultMax} Points</p>
        </div>
        <div className="neo-card bg-card p-5">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <Users className="h-5 w-5" />
            <span className="font-display text-sm uppercase tracking-wide">Placement Threshold</span>
          </div>
          <p className="text-2xl font-bold">
            {minimumRatingsThreshold} rating
            {minimumRatingsThreshold === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <Alert className="border-[3px] border-foreground bg-card">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>How the leaderboard is calculated</AlertTitle>
        <AlertDescription>
          {scoreDescription} {entryLabel}s need at least {minimumRatingsThreshold} public rating
          {minimumRatingsThreshold === 1 ? "" : "s"} before they receive a place.
        </AlertDescription>
      </Alert>

      {competition.leaderboardSettings.scoringMethod === "behzod_formula" ? (
        <>
          <div className="neo-card bg-card p-6">
            <h3 className="mb-3 text-2xl font-bold">Confidence-Adjusted Formula, in plain language</h3>
            <div className="space-y-3 font-body text-foreground/85">
              <p>
                This confidence-adjusted formula is not a new raw scoring system. Each guest rating is first converted into
                a total score using the competition&apos;s scoring setup, then normalized to the competition&apos;s configured
                {` `}
                {resultMax}-point leaderboard scale.
              </p>
              <p>
                Those total scores are averaged for each {itemLabel} to produce that {itemLabel}&apos;s own score <strong>R</strong>.
                The confidence-adjusted formula then blends that {itemLabel} average with the overall competition average
                <strong> C</strong>.
              </p>
              <p>
                If a {itemLabel} has very few ratings, its score is pulled closer to <strong>C</strong>. If it has many ratings,
                its score stays much closer to its own average <strong>R</strong>. This reduces the chance that a tiny
                number of perfect ratings dominates the leaderboard.
              </p>
              <p>
                The minimum ratings threshold is used twice: it is the requirement for taking a place on the leaderboard,
                and it is also the <strong>m</strong> value inside this formula.
              </p>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="neo-card bg-card p-6">
              <h3 className="mb-4 text-2xl font-bold">Formula</h3>
              <div className="overflow-x-auto border-[3px] border-foreground bg-background p-4 font-mono text-sm font-semibold sm:text-base">
                Adjusted Score = (v / (v + m)) × R + (m / (v + m)) × C
              </div>
              <div className="mt-4 space-y-3 font-body text-sm text-foreground/85">
                <p>
                  <strong>R</strong> = the {itemLabel}&apos;s average score after each guest rating has already been converted
                  using the competition&apos;s scoring setup and normalized to the competition&apos;s leaderboard max.
                </p>
                <p>
                  <strong>v</strong> = the number of ratings received by that {itemLabel}.
                </p>
                <p>
                  <strong>C</strong> = the overall average across rated {entryLabel.toLowerCase()}s, based on those already
                  normalized averages.
                </p>
                <p>
                  <strong>m</strong> = the minimum ratings threshold configured in leaderboard settings.
                </p>
                <p className="font-semibold">
                  The competition&apos;s internal scoring setup is already included before this formula is applied. <code>R</code>
                  and <code>C</code> are not raw criterion averages.
                </p>
              </div>
            </div>

            <div className="neo-card bg-card p-6">
              <h3 className="mb-4 text-2xl font-bold">Worked Example</h3>
              <div className="space-y-4 font-body text-sm text-foreground/85">
                <p>
                  This example uses <strong>m = {minimumRatingsThreshold}</strong> and
                  {` `}
                  <strong>C = {formatCompetitionScore(exampleCompetitionAverage, resultMax)}</strong>
                  {competitionAverageScore > 0
                    ? ` from the current rated ${entryLabel.toLowerCase()}s.`
                    : " as an illustrative competition-wide average."}
                </p>
                <p>
                  {entryLabel} A has a perfect average of <strong>{formatCompetitionScore(examplePerfectScore, resultMax)}</strong>
                  {` `}
                  from <strong>{exampleQuickRatings}</strong> ratings:
                </p>
                <p className="overflow-x-auto font-mono">
                  ({exampleQuickRatings} / ({exampleQuickRatings} + {minimumRatingsThreshold})) × {examplePerfectScore.toFixed(1)} + ({minimumRatingsThreshold} / ({exampleQuickRatings} + {minimumRatingsThreshold})) × {exampleCompetitionAverage.toFixed(1)} = {exampleQuickAdjusted.toFixed(2)}
                </p>
                <p>
                  {entryLabel} B has a slightly lower average of <strong>{formatCompetitionScore(exampleSteadyScore, resultMax)}</strong>
                  {` `}
                  from <strong>{exampleSteadyRatings}</strong> ratings:
                </p>
                <p className="overflow-x-auto font-mono">
                  ({exampleSteadyRatings} / ({exampleSteadyRatings} + {minimumRatingsThreshold})) × {exampleSteadyScore.toFixed(1)} + ({minimumRatingsThreshold} / ({exampleSteadyRatings} + {minimumRatingsThreshold})) × {exampleCompetitionAverage.toFixed(1)} = {exampleSteadyAdjusted.toFixed(2)}
                </p>
                <p>
                  This is the same idea as saying that 5.0/5 from 6 ratings should not automatically beat 4.8/5 from
                  50 ratings. This confidence-adjusted formula rewards quality and confidence from a larger sample size.
                </p>
              </div>
            </div>
          </div>

          <div className="neo-card bg-card p-6">
            <h3 className="mb-4 text-2xl font-bold">For advanced users</h3>
            <div className="space-y-3 font-body text-foreground/85">
              <p>
                1. Each guest rating is first converted into a total score using the competition&apos;s scoring setup and
                normalized to <code>leaderboard_settings.result_max</code>.
              </p>
              <p>
                2. Those total scores are averaged per {itemLabel} to produce <strong>R</strong>.
              </p>
              <p>
                3. The rated {entryLabel.toLowerCase()}s&apos; averages are aggregated to produce <strong>C</strong>.
              </p>
              <p>
                4. The configured <code>minimum_ratings_threshold</code> is both the placement requirement and the
                <strong> m </strong> value inside this formula.
              </p>
              <p>
                5. {entryLabel}s below the threshold can still show their current score, but they remain unranked and do not
                take a leaderboard place.
              </p>
            </div>
          </div>
        </>
      ) : null}

      {ratings.length === 0 ? (
        <div className="neo-card bg-card p-8">
          <h3 className="mb-2 text-2xl font-bold">No ratings yet</h3>
          <p className="font-body text-muted-foreground">
            The leaderboard will appear here once public ratings are submitted.
          </p>
        </div>
      ) : (
        <>
          {rankedEntries.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-3">
              {rankedEntries.slice(0, 3).map((entry, index) => (
                <div key={entry.entry.id} className={`neo-card p-6 ${podiumStyles[index] ?? "bg-card"}`}>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="neo-badge bg-background text-foreground">#{entry.rank}</span>
                    <Medal className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-2xl font-bold">{getCompetitionEntryTitle(entry.entry)}</h3>
                  <p className="mb-4 font-body text-sm opacity-80">{entry.entry.competitorName}</p>
                  <div className="grid grid-cols-2 gap-3 font-body text-sm">
                    <div>
                      <p className="uppercase tracking-wide opacity-70">Leaderboard Score</p>
                      <p className="text-lg font-bold">
                        {formatCompetitionScore(entry.leaderboardScore, resultMax)}
                      </p>
                    </div>
                    <div>
                      <p className="uppercase tracking-wide opacity-70">Ratings</p>
                      <p className="text-lg font-bold">{entry.ratingCount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="neo-card bg-card p-8">
              <h3 className="mb-2 text-2xl font-bold">Ratings are still collecting</h3>
              <p className="font-body text-muted-foreground">
                Public votes have started, but no {itemLabel} has reached the placement threshold yet.
              </p>
            </div>
          )}

          <div className="space-y-4 md:hidden">
            {leaderboardEntries.map((entry) => (
              <div key={entry.entry.id} className="neo-card bg-card p-5">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-display text-xl font-bold">{getCompetitionEntryTitle(entry.entry)}</p>
                    <p className="font-body text-sm text-muted-foreground">{entry.entry.competitorName}</p>
                  </div>
                  <span className="neo-badge bg-background text-foreground">
                    {entry.rank ? `#${entry.rank}` : "Unranked"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="font-display uppercase tracking-wide text-muted-foreground">Leaderboard</p>
                    <p className="font-body font-semibold">
                      {formatDisplayedScore(entry.leaderboardScore, resultMax, entry.ratingCount)}
                    </p>
                  </div>
                  <div>
                    <p className="font-display uppercase tracking-wide text-muted-foreground">Average</p>
                    <p className="font-body font-semibold">
                      {formatDisplayedScore(entry.averageTotalScore, resultMax, entry.ratingCount)}
                    </p>
                  </div>
                  <div>
                    <p className="font-display uppercase tracking-wide text-muted-foreground">Ratings</p>
                    <p className="font-body font-semibold">{entry.ratingCount}</p>
                  </div>
                  <div>
                    <p className="font-display uppercase tracking-wide text-muted-foreground">Status</p>
                    <p className="font-body font-semibold">
                      {getStatusLabel(entry.ratingCount, entry.pendingRatings, entry.qualified)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="neo-card hidden bg-card p-4 md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Place</TableHead>
                  <TableHead>{entryLabel}</TableHead>
                  <TableHead>Competitor</TableHead>
                  <TableHead>Ratings</TableHead>
                  <TableHead>Average</TableHead>
                  <TableHead>Leaderboard Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardEntries.map((entry) => (
                  <TableRow key={entry.entry.id}>
                    <TableCell className="font-display font-bold">
                      {entry.rank ? (
                        <span className="inline-flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-secondary" />
                          #{entry.rank}
                        </span>
                      ) : (
                        "Unranked"
                      )}
                    </TableCell>
                    <TableCell className="font-semibold">{getCompetitionEntryTitle(entry.entry)}</TableCell>
                    <TableCell>{entry.entry.competitorName}</TableCell>
                    <TableCell>{entry.ratingCount}</TableCell>
                    <TableCell>{formatDisplayedScore(entry.averageTotalScore, resultMax, entry.ratingCount)}</TableCell>
                    <TableCell>{formatDisplayedScore(entry.leaderboardScore, resultMax, entry.ratingCount)}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-2">
                        {entry.qualified ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : (
                          <ShieldAlert className="h-4 w-4 text-coral" />
                        )}
                        {getStatusLabel(entry.ratingCount, entry.pendingRatings, entry.qualified)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};
