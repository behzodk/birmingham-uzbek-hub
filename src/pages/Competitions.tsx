import { Link } from "react-router-dom";
import { MapPin, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { fetchPublicCompetitions } from "@/services/competitionService";

const Competitions = () => {
  const { data: competitions = [], isLoading } = useQuery({
    queryKey: ["public-competitions"],
    queryFn: fetchPublicCompetitions,
  });

  const featuredCompetition = competitions.find((competition) => competition.isFeatured) ?? null;
  const remainingCompetitions = competitions.filter((competition) => competition.id !== featuredCompetition?.id);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="Competitions"
        description="Browse public competitions, approved items, and public rating pages."
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-accent/60 py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none uzbek-pattern opacity-15" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl">
            <span className="neo-badge mb-4 inline-block bg-coral text-coral-foreground">Public Competitions</span>
            <h1 className="mb-5 text-4xl font-black sm:text-5xl md:text-7xl">
              Rate, Scan, <span className="text-stroke text-transparent">Explore Competitions</span>
            </h1>
            <p className="font-body text-lg text-foreground/80 md:text-xl">
              Explore published competitions, open each approved item&apos;s rating page, and use public registration and
              rating access.
            </p>
          </div>
        </div>
      </section>

      {featuredCompetition ? (
        <section className="bg-muted py-12">
          <div className="container mx-auto px-4">
            <div className="neo-card overflow-hidden bg-card">
              <div className="grid gap-0 lg:grid-cols-[1.2fr_minmax(0,1fr)]">
                <div
                  className="relative min-h-[280px] border-b-[3px] border-foreground bg-primary lg:border-b-0 lg:border-r-[3px]"
                  style={
                    featuredCompetition.featuredImage
                      ? {
                          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.42)), url(${featuredCompetition.featuredImage})`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }
                      : undefined
                  }
                >
                  <div className="absolute left-6 top-6">
                    <span className="neo-badge bg-secondary text-secondary-foreground">Featured Competition</span>
                  </div>
                </div>
                <div className="p-8 md:p-10">
                  <h2 className="mb-3 text-3xl font-bold">{featuredCompetition.title}</h2>
                  <p className="mb-6 font-body text-muted-foreground">
                    {featuredCompetition.description ?? "Public competition details and voting are available now."}
                  </p>
                  <div className="mb-6 grid gap-3 text-sm font-body text-foreground/85 md:grid-cols-2">
                    {featuredCompetition.location ? (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{featuredCompetition.location}</span>
                      </div>
                    ) : null}
                    {featuredCompetition.capacity !== null ? (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{featuredCompetition.capacity} capacity</span>
                      </div>
                    ) : null}
                  </div>
                  <Button size="lg" asChild>
                    <Link to={`/competitions/${featuredCompetition.slug}`}>View Competition</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">Published Competitions</h2>
              <p className="font-body text-muted-foreground">
                Only public, published competitions appear here.
              </p>
            </div>
          </div>

          {competitions.length === 0 ? (
            <div className="neo-card bg-card p-10 text-center">
              <h3 className="mb-2 text-2xl font-bold">No public competitions right now</h3>
              <p className="font-body text-muted-foreground">
                Check back later for published competitions and public rating pages.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {(featuredCompetition ? remainingCompetitions : competitions).map((competition) => (
                <div key={competition.id} className="neo-card flex flex-col overflow-hidden bg-card">
                  <div
                    className="h-48 border-b-[3px] border-foreground bg-accent"
                    style={
                      competition.featuredImage
                        ? {
                            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.18), rgba(0, 0, 0, 0.34)), url(${competition.featuredImage})`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                          }
                        : undefined
                    }
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-3 text-2xl font-bold">{competition.title}</h3>
                    <p className="mb-5 font-body text-muted-foreground">
                      {competition.description ?? "Open the competition page to view approved items and public rating access."}
                    </p>
                    <div className="mb-6 space-y-3 text-sm font-body text-foreground/85">
                      {competition.location ? (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{competition.location}</span>
                        </div>
                      ) : null}
                    </div>
                    <Button asChild className="mt-auto">
                      <Link to={`/competitions/${competition.slug}`}>Open Competition</Link>
                    </Button>
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

export default Competitions;
