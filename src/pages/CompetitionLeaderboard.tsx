import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Trophy } from "lucide-react";
import { CompetitionLeaderboard as LeaderboardView } from "@/components/competition/CompetitionLeaderboard";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { getCompetitionEntryLabel } from "@/lib/competition";
import { fetchPublicCompetitionLeaderboardBySlug } from "@/services/competitionService";

const CompetitionLeaderboardPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["public-competition-leaderboard", slug],
    queryFn: () => fetchPublicCompetitionLeaderboardBySlug(slug!),
    enabled: Boolean(slug),
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
        <SEO title="Leaderboard Not Found" />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-3 text-4xl font-bold">Leaderboard Not Found</h1>
          <p className="mb-8 font-body text-muted-foreground">
            This public competition could not be found.
          </p>
          <Button onClick={() => navigate("/competitions")}>
            <ArrowLeft className="h-4 w-4" />
            Back to Competitions
          </Button>
        </div>
      </Layout>
    );
  }

  const { competition, entries, ratings } = data;
  const entryLabel = getCompetitionEntryLabel(competition);

  return (
    <Layout>
      <SEO
        title={`${competition.title} Leaderboard`}
        description={`Public leaderboard for ${competition.title}.`}
        image={competition.featuredImage ?? "/og-image.jpg"}
        url={typeof window !== "undefined" ? window.location.href : undefined}
      />

      <section className="bg-primary py-14 text-primary-foreground md:py-20">
        <div className="container mx-auto px-4">
          <Button variant="ghost" className="mb-6 text-primary-foreground hover:bg-white/10" onClick={() => navigate(`/competitions/${competition.slug}`)}>
            <ArrowLeft className="h-4 w-4" />
            Back to Competition
          </Button>
          <div className="max-w-4xl">
            <span className="neo-badge mb-4 inline-block bg-secondary text-secondary-foreground">Public Leaderboard</span>
            <h1 className="mb-4 text-4xl font-black sm:text-5xl">{competition.title}</h1>
            <p className="font-body text-lg text-primary-foreground/85">
              Rankings for approved {entryLabel.toLowerCase()}s based on public ratings and the configured leaderboard rules.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-body text-primary-foreground/85">
              <span className="inline-flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                {competition.leaderboardSettings.resultMax} point result scale
              </span>
              <span>{entries.length} approved {entryLabel.toLowerCase()}s</span>
              <span>{ratings.length} public ratings</span>
            </div>
            <div className="mt-6">
              <Button asChild variant="secondary">
                <Link to={`/competitions/${competition.slug}`}>Open Competition Page</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <LeaderboardView competition={competition} entries={entries} ratings={ratings} />
        </div>
      </section>
    </Layout>
  );
};

export default CompetitionLeaderboardPage;
