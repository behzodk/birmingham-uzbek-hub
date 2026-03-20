import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ChevronDown, MapPin, User } from "lucide-react";
import { CompetitionRatingForm } from "@/components/competition/CompetitionRatingForm";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { getCompetitionEntryLabel, getCompetitionEntryTitle } from "@/lib/competition";
import { fetchPublicRatingPageData } from "@/services/competitionService";

const CompetitionRate = () => {
  const { ratingPublicId } = useParams<{ ratingPublicId: string }>();
  const navigate = useNavigate();
  const [showScrollHint, setShowScrollHint] = useState(true);

  const { data, isLoading } = useQuery({
    queryKey: ["public-competition-rate", ratingPublicId],
    queryFn: () => fetchPublicRatingPageData(ratingPublicId!),
    enabled: Boolean(ratingPublicId),
  });

  useEffect(() => {
    if (!data || typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    setShowScrollHint(true);

    const ratingForm = document.getElementById("rating-form");
    if (!ratingForm || !("IntersectionObserver" in window)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollHint(!entry.isIntersecting);
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(ratingForm);

    return () => {
      observer.disconnect();
    };
  }, [data]);

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
        <SEO title="Rating Page Not Found" />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-3 text-4xl font-bold">Rating Page Not Found</h1>
          <p className="mb-8 font-body text-muted-foreground">
            This public rating link is invalid or no longer available.
          </p>
          <Button onClick={() => navigate("/competitions")}>
            <ArrowLeft className="h-4 w-4" />
            Back to Competitions
          </Button>
        </div>
      </Layout>
    );
  }

  const { competition, entry } = data;
  const entryLabel = getCompetitionEntryLabel(competition);
  const ratingMoments =
    competition.ratingCriteria.length > 0
      ? competition.ratingCriteria.map((criterion) => criterion.label)
      : [`Rate this ${entryLabel.toLowerCase()}`, competition.title, getCompetitionEntryTitle(entry)];
  const marqueeItems = [...ratingMoments, ...ratingMoments, ...ratingMoments];
  const scrollToRatingForm = () => {
    if (typeof document === "undefined") return;
    document.getElementById("rating-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Layout>
      <SEO
        title={`Rate ${getCompetitionEntryTitle(entry)}`}
        description={`Public rating page for ${getCompetitionEntryTitle(entry)} in ${competition.title}.`}
        image={entry.entryImage ?? competition.featuredImage ?? "/og-image.jpg"}
        url={typeof window !== "undefined" ? window.location.href : undefined}
      />

      <section className="relative overflow-hidden bg-accent py-10 text-accent-foreground sm:py-12 md:py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 uzbek-pattern opacity-10" />
          <div
            className="absolute -left-10 top-6 h-28 w-28 rounded-full border-[5px] border-foreground/15 animate-spin-slow sm:h-40 sm:w-40"
            style={{ animationDuration: "28s" }}
          />
          <div
            className="absolute -right-8 bottom-10 h-20 w-20 rotate-12 border-[3px] border-foreground bg-secondary/70 animate-spin-slow sm:h-28 sm:w-28"
            style={{ animationDuration: "16s", animationDirection: "reverse" }}
          />
          <div className="absolute left-[8%] bottom-10 hidden h-4 w-4 rounded-full bg-foreground/70 animate-pulse-scale sm:block" />
          <div className="absolute right-[10%] top-24 hidden animate-float sm:block">
            <div className="neo-badge rotate-6 bg-coral text-coral-foreground">Live Rating</div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex h-3">
            {Array.from({ length: 16 }).map((_, index) => (
              <div
                key={index}
                className={index % 2 === 0 ? "flex-1 bg-secondary/35" : "flex-1 bg-coral/25"}
              />
            ))}
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6 w-full justify-start px-0 text-left hover:bg-transparent sm:w-auto sm:px-4 sm:hover:bg-black/10 animate-bounce-in"
            onClick={() => navigate(`/competitions/${competition.slug}`)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Competition
          </Button>
          <div className="max-w-4xl">
            <span className="neo-badge mb-4 inline-block bg-secondary text-secondary-foreground animate-bounce-in">
              Public Rating Page
            </span>
            <h1
              className="mb-4 text-[clamp(3rem,14vw,5rem)] font-black leading-none animate-bounce-in"
              style={{ animationDelay: "80ms", animationFillMode: "both" }}
            >
              {getCompetitionEntryTitle(entry)}
            </h1>
            <p
              className="max-w-2xl font-body text-base text-accent-foreground/80 sm:text-lg animate-bounce-in"
              style={{ animationDelay: "140ms", animationFillMode: "both" }}
            >
              Submit a public rating for this {entryLabel.toLowerCase()} in {competition.title}.
            </p>
            <div
              className="mt-6 flex flex-wrap gap-3 animate-bounce-in"
              style={{ animationDelay: "200ms", animationFillMode: "both" }}
            >
              <span className="neo-badge bg-background text-foreground">Judge Fairly</span>
              <span className="neo-badge bg-coral text-coral-foreground">One Student, One Vote</span>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y-[3px] border-foreground bg-secondary py-3">
        <div className="flex w-max animate-slide-left whitespace-nowrap">
          {marqueeItems.map((label, index) => (
            <div key={`${label}-${index}`} className="mx-3 inline-flex items-center gap-3 text-secondary-foreground">
              <span className="h-2.5 w-2.5 bg-foreground" />
              <span className="font-display text-sm uppercase tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative py-8 sm:py-10 md:py-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background to-muted/40" />
        <div className="pointer-events-none absolute right-[4%] top-16 hidden animate-float lg:block">
          <div className="neo-card rotate-3 bg-secondary px-5 py-3 text-sm font-display uppercase tracking-wide text-secondary-foreground">
            Rate With Care
          </div>
        </div>
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid gap-6 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
            <div className="space-y-4 lg:space-y-6">
              <div
                className="neo-card overflow-hidden bg-card animate-bounce-in"
                style={{ animationDelay: "120ms", animationFillMode: "both" }}
              >
                <div className="relative">
                  <div className="absolute left-4 top-4 z-10">
                    <span className="neo-badge bg-secondary text-secondary-foreground">Ready to Judge</span>
                  </div>
                  <div
                    className="h-52 border-b-[3px] border-foreground bg-primary sm:h-64"
                    style={
                      entry.entryImage
                        ? {
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.3)), url(${entry.entryImage})`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                          }
                        : undefined
                    }
                  />
                </div>
                <div className="space-y-4 p-4 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xl font-bold sm:text-2xl">{getCompetitionEntryTitle(entry)}</p>
                      <p className="mt-1 font-body text-sm uppercase tracking-wide text-muted-foreground">
                        {entryLabel} by {entry.competitorName}
                      </p>
                    </div>
                    <span className="neo-badge bg-background text-foreground">{competition.title}</span>
                  </div>
                  <p className="font-body text-muted-foreground">
                    {entry.entryDescription ?? "Use the form below to submit your score and optional notes."}
                  </p>
                  <div className="space-y-3 font-body text-sm text-foreground/85">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <span>{entry.competitorName}</span>
                    </div>
                    {competition.location ? (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{competition.location}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div id="rating-form" className="scroll-mt-24">
              <div
                className="relative animate-bounce-in"
                style={{ animationDelay: "200ms", animationFillMode: "both" }}
              >
                <div
                  className="pointer-events-none absolute -right-2 -top-2 hidden h-16 w-16 rotate-12 border-[3px] border-foreground bg-coral lg:block animate-spin-slow"
                  style={{ animationDuration: "18s", animationDirection: "reverse" }}
                />
                <CompetitionRatingForm competition={competition} entry={entry} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {showScrollHint ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 md:hidden">
          <button
            type="button"
            onClick={scrollToRatingForm}
            className="pointer-events-auto neo-card inline-flex items-center gap-2 rounded-full bg-card px-4 py-2.5 text-sm font-display font-bold text-card-foreground shadow-lg"
          >
            <span>Scroll to rate</span>
            <ChevronDown className="h-4 w-4 motion-safe:animate-bounce text-primary" />
          </button>
        </div>
      ) : null}
    </Layout>
  );
};

export default CompetitionRate;
