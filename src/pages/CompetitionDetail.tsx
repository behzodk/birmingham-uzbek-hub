import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  MapPin,
  QrCode,
  Star,
  Users,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { CompetitionQrDialog } from "@/components/competition/CompetitionQrDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  getCompetitionCriteriaSummary,
  getCompetitionEntryLabel,
  getCompetitionEntryTitle,
  getCompetitionVoteRules,
  isCompetitionRegistrationOpen,
} from "@/lib/competition";
import {
  fetchApprovedCompetitionEntries,
  fetchPublicCompetitionBySlug,
} from "@/services/competitionService";

const CompetitionDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: competition, isLoading } = useQuery({
    queryKey: ["public-competition", slug],
    queryFn: () => fetchPublicCompetitionBySlug(slug!),
    enabled: Boolean(slug),
  });

  const { data: entries = [], isLoading: entriesLoading } = useQuery({
    queryKey: ["public-competition-entries", competition?.id],
    queryFn: () => fetchApprovedCompetitionEntries(competition!.id),
    enabled: Boolean(competition?.id),
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  if (!competition) {
    return (
      <Layout>
        <SEO title="Competition Not Found" />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-3 text-4xl font-bold">Competition Not Found</h1>
          <p className="mb-8 font-body text-muted-foreground">
            This competition is not published publicly or the link is invalid.
          </p>
          <Button onClick={() => navigate("/competitions")}>
            <ArrowLeft className="h-4 w-4" />
            Back to Competitions
          </Button>
        </div>
      </Layout>
    );
  }

  const entryLabel = getCompetitionEntryLabel(competition);
  const criteriaSummary = getCompetitionCriteriaSummary(competition.ratingCriteria);
  const voteRules = getCompetitionVoteRules(competition);
  const registrationOpen = isCompetitionRegistrationOpen(competition);

  return (
    <Layout>
      <SEO
        title={competition.title}
        description={competition.description ?? `Public competition details for ${competition.title}.`}
        image={competition.featuredImage ?? "/og-image.jpg"}
        url={typeof window !== "undefined" ? window.location.href : undefined}
      />

      <section
        className="relative overflow-hidden py-14 md:py-20"
        style={
          competition.featuredImage
            ? {
                backgroundImage: `linear-gradient(rgba(7, 15, 35, 0.72), rgba(7, 15, 35, 0.72)), url(${competition.featuredImage})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }
            : { background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }
        }
      >
        <div className="container mx-auto px-4 text-white">
          <Button variant="ghost" className="mb-6 text-white hover:bg-white/15" onClick={() => navigate("/competitions")}>
            <ArrowLeft className="h-4 w-4" />
            Back to Competitions
          </Button>

          <div className="max-w-4xl">
            <span className="neo-badge mb-4 inline-block bg-secondary text-secondary-foreground">Public Competition</span>
            <h1 className="mb-5 text-4xl font-black sm:text-5xl md:text-6xl">{competition.title}</h1>
            <p className="max-w-3xl font-body text-lg text-white/85 md:text-xl">
              {competition.description ?? "Public voting and registration are available here."}
            </p>

            <div className="mt-8 grid gap-4 text-sm font-body md:grid-cols-2 xl:grid-cols-4">
              {competition.location ? (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{competition.location}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
            <div className="space-y-6">
              {competition.contentHtml ? (
                <div className="recipe" dangerouslySetInnerHTML={{ __html: competition.contentHtml }} />
              ) : (
                <div className="neo-card bg-card p-8">
                  <h2 className="mb-3 text-2xl font-bold">About This Competition</h2>
                  <p className="font-body text-lg text-muted-foreground">
                    {competition.description ?? "Public competition details will appear here once they are published."}
                  </p>
                </div>
              )}

              <Alert className="border-[3px] border-foreground bg-card">
                <QrCode className="h-4 w-4" />
                <AlertTitle>Public voting rules</AlertTitle>
                <AlertDescription>
                  <div className="space-y-2">
                    {voteRules.map((rule) => (
                      <p key={rule}>{rule}</p>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            </div>

            <div className="space-y-6">
              <div className="neo-card bg-card p-6">
                <h2 className="mb-4 text-2xl font-bold">Competition Access</h2>
                <div className="space-y-3 font-body text-sm text-foreground/85">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>
                      {entries.length} approved {entryLabel.toLowerCase()}
                      {entries.length === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span>{competition.ratingCriteria.length} rating criteria</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-primary" />
                    <span>QR-based public rating access is available for approved {entryLabel.toLowerCase()}s.</span>
                  </div>
                </div>
                <div className="mt-6">
                  {registrationOpen ? (
                    <Button asChild className="w-full">
                      <Link to={`/competitions/${competition.slug}/register`}>Register Your {entryLabel}</Link>
                    </Button>
                  ) : (
                    <Button className="w-full" disabled>
                      Registration Closed
                    </Button>
                  )}
                </div>
                <p className="mt-3 font-body text-sm text-muted-foreground">
                  {registrationOpen
                    ? "Public registration is currently open."
                    : "Public registration is not currently open for this competition."}
                </p>
              </div>

              <div className="neo-card bg-card p-6">
                <h2 className="mb-4 text-2xl font-bold">Scoring Criteria</h2>
                {competition.ratingCriteria.length > 0 ? (
                  <div className="space-y-4">
                    {competition.ratingCriteria.map((criterion) => (
                      <div key={criterion.id} className="border-b-[2px] border-foreground/10 pb-4 last:border-b-0 last:pb-0">
                        <div className="mb-1 flex items-start justify-between gap-3">
                          <h3 className="text-lg font-bold">{criterion.label}</h3>
                        </div>
                        {criterion.description ? (
                          <p className="mb-2 font-body text-sm text-muted-foreground">{criterion.description}</p>
                        ) : null}
                        <p className="font-body text-sm text-foreground/80">
                          {criterion.scaleType === "stars" ? "Star" : "Numeric"} scale from {criterion.scaleMin} to{" "}
                          {criterion.scaleMax}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-body text-muted-foreground">
                    Public rating is not available yet because the competition has no criteria configured.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted py-14">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <span className="neo-badge mb-3 inline-block bg-coral text-coral-foreground">Approved {entryLabel}s</span>
              <h2 className="text-3xl font-bold">Public Rating Access</h2>
              <p className="font-body text-muted-foreground">
                Share access by QR code without surfacing the direct public rating page in this list.
              </p>
            </div>
          </div>

          {entriesLoading ? (
            <div className="flex min-h-[20vh] items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
            </div>
          ) : entries.length === 0 ? (
            <div className="neo-card bg-card p-8">
              <h3 className="mb-2 text-2xl font-bold">No approved {entryLabel.toLowerCase()}s yet</h3>
              <p className="font-body text-muted-foreground">
                Public voting will appear here once approved {entryLabel.toLowerCase()}s are available.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {entries.map((entry) => (
                <div key={entry.id} className="neo-card flex flex-col overflow-hidden bg-card">
                  <div
                    className="h-52 border-b-[3px] border-foreground bg-accent"
                    style={
                      entry.entryImage
                        ? {
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.28)), url(${entry.entryImage})`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                          }
                        : undefined
                    }
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-1 text-2xl font-bold">{getCompetitionEntryTitle(entry)}</h3>
                    <p className="mb-3 font-body text-sm uppercase tracking-wide text-muted-foreground">
                      By {entry.competitorName}
                    </p>
                    <p className="mb-6 font-body text-muted-foreground">
                      {entry.entryDescription ?? "Open the public rating page to submit your vote."}
                    </p>
                    <div className="mt-auto">
                      <CompetitionQrDialog entry={entry} itemLabel={entryLabel} note={criteriaSummary} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CompetitionDetail;
