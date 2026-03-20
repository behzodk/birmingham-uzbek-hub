import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Clock3, QrCode } from "lucide-react";
import { CompetitionQrAccessCard } from "@/components/competition/CompetitionQrAccessCard";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { buildCompetitionRatingUrl, getCompetitionEntryLabel, getCompetitionEntryTitle } from "@/lib/competition";
import { fetchCompetitionEntryForRegistrationSuccess } from "@/services/competitionService";

const CompetitionRegistrationSuccess = () => {
  const { slug, ratingId } = useParams<{ slug: string; ratingId: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["competition-registration-success", slug, ratingId],
    queryFn: () => fetchCompetitionEntryForRegistrationSuccess(slug!, ratingId!),
    enabled: Boolean(slug && ratingId),
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

  if (!data) {
    return (
      <Layout>
        <SEO title="Registration Not Found" />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-3 text-4xl font-bold">Registration Not Found</h1>
          <p className="mb-8 font-body text-muted-foreground">
            We couldn&apos;t find that competition registration record.
          </p>
          <Button asChild>
            <Link to="/competitions">
              <ArrowLeft className="h-4 w-4" />
              Back to Competitions
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const { competition, entry } = data;
  const ratingUrl = buildCompetitionRatingUrl(entry.ratingPublicId);
  const entryLabel = getCompetitionEntryLabel(competition);

  return (
    <Layout>
      <SEO
        title={`${getCompetitionEntryTitle(entry)} Registered`}
        description={`${entryLabel} registration success for ${getCompetitionEntryTitle(entry)} in ${competition.title}.`}
        image={entry.entryImage ?? competition.featuredImage ?? "/og-image.jpg"}
        url={typeof window !== "undefined" ? window.location.href : undefined}
      />

      <section className="bg-accent py-14 text-accent-foreground md:py-20">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6 hover:bg-black/10"
            onClick={() => navigate(`/competitions/${competition.slug}`)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Competition
          </Button>
          <div className="max-w-4xl">
            <span className="neo-badge mb-4 inline-block bg-secondary text-secondary-foreground">
              Registration Successful
            </span>
            <h1 className="mb-4 text-4xl font-black sm:text-5xl">{getCompetitionEntryTitle(entry)}</h1>
            <p className="font-body text-lg text-accent-foreground/80">
              Your {entryLabel.toLowerCase()} is registered successfully. The public rating link and QR code are ready right away.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
              <div className="neo-card bg-card p-6">
                <div className="mb-3 flex items-center gap-3 text-primary">
                  <CheckCircle2 className="h-6 w-6" />
                  <h2 className="text-2xl font-bold">{entryLabel} Saved</h2>
                </div>
                <p className="font-body text-muted-foreground">
                  {getCompetitionEntryTitle(entry)} has been created for {competition.title}.
                </p>
              </div>

              <Alert className="border-[3px] border-foreground bg-card">
                <Clock3 className="h-4 w-4" />
                <AlertTitle>{entryLabel} is approved</AlertTitle>
                <AlertDescription>
                  This {entryLabel.toLowerCase()} is created as <strong>approved</strong>, so the public rating link and QR
                  code should be usable now.
                </AlertDescription>
              </Alert>
            </div>

            <div className="neo-card bg-card p-6">
              <div className="mb-5 flex items-center gap-3">
                <QrCode className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="text-2xl font-bold">Public Rating Access</h2>
                  <p className="font-body text-sm text-muted-foreground">
                    Share the raw link or QR code now. Public rating is available immediately after registration.
                  </p>
                </div>
              </div>

              <CompetitionQrAccessCard title={getCompetitionEntryTitle(entry)} url={ratingUrl} />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link to={`/competitions/${competition.slug}`}>Return to Competition</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={`/competitions/${competition.slug}/register`}>Register Another {entryLabel}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CompetitionRegistrationSuccess;
