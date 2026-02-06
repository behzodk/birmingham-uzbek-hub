import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, ArrowRight, ArrowLeft, Clock, MapPin } from "lucide-react";
import Lottie from "lottie-react";

interface LocationState {
  formTitle?: string;
  submittedAt?: string;
}

const FormSuccess = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { state } = useLocation();
  const { formTitle, submittedAt } = (state as LocationState) || {};
  const [animationData, setAnimationData] = useState<Record<string, unknown> | null>(null);

  const displayTitle = formTitle || "Registration Received";
  const submittedDate = submittedAt ? new Date(submittedAt).toLocaleString() : null;

  useEffect(() => {
    let isMounted = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetch("/Success.json")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setAnimationData(data);
      })
      .catch(() => {
        if (isMounted) setAnimationData(null);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Layout>
      <SEO title={`${displayTitle} — Success`} />
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/80 via-secondary to-accent/80 py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-background/20 blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="neo-card bg-card border-[5px] border-foreground shadow-[14px_14px_0px_0px_hsl(var(--foreground))] px-6 py-10 md:px-12 md:py-14 text-foreground">
              <div className="flex flex-col items-center text-center space-y-6">
                {animationData ? (
                  <div className="w-full max-w-md mx-auto">
                    <Lottie animationData={animationData} loop={false} />
                  </div>
                ) : (
                  <div className="grid place-items-center h-20 w-20 rounded-2xl border-[6px] border-foreground bg-primary text-background shadow-[10px_10px_0px_0px_hsl(var(--foreground))]">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                )}

                <div className="inline-flex items-center gap-2 rounded-full border-[4px] border-foreground bg-background px-4 py-2 text-xs md:text-sm font-semibold uppercase tracking-tight shadow-[6px_6px_0px_0px_hsl(var(--foreground))]">
                  <Sparkles className="h-4 w-4" />
                  Submission saved
                </div>

                <div className="space-y-2">
                  <h1 className="font-display text-4xl md:text-5xl font-black leading-tight">
                    {displayTitle}
                  </h1>
                  <p className="font-body text-base md:text-lg text-foreground/80 max-w-2xl mx-auto">
                    We’ve locked in your spot. Expect a follow-up email with any prep details and next steps.
                  </p>
                </div>

                <div className="grid gap-3 w-full md:grid-cols-3">
                  {submittedDate && (
                    <div className="rounded-xl border-[3px] border-foreground bg-muted px-4 py-3 shadow-[6px_6px_0px_0px_hsl(var(--foreground))] flex items-center gap-2 justify-center">
                      <Clock className="h-4 w-4" />
                      <span className="font-body text-sm md:text-base">Submitted {submittedDate}</span>
                    </div>
                  )}
                  <div className="rounded-xl border-[3px] border-foreground bg-muted px-4 py-3 shadow-[6px_6px_0px_0px_hsl(var(--foreground))] flex items-center gap-2 justify-center">
                    <MapPin className="h-4 w-4" />
                    <span className="font-body text-sm md:text-base">Uzbek Society Hub</span>
                  </div>
                  <div className="rounded-xl border-[3px] border-foreground bg-muted px-4 py-3 shadow-[6px_6px_0px_0px_hsl(var(--foreground))] flex items-center gap-2 justify-center">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-body text-sm md:text-base">You’re all set</span>
                  </div>
                </div>

                <div className="w-full rounded-2xl border-[4px] border-foreground bg-background px-6 py-5 shadow-[10px_10px_0px_0px_hsl(var(--foreground))] text-left space-y-3">
                  <h2 className="font-display text-lg md:text-xl font-bold">What happens next</h2>
                  <ol className="list-decimal pl-5 space-y-2 font-body text-base text-foreground/90">
                    <li>Our organizers review registrations and confirm roles within 48 hours.</li>
                    <li>You’ll get an email with timings, venue specifics, and prep material.</li>
                    <li>Want to explore meanwhile? Check our events calendar or return to the form.</li>
                  </ol>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-center">
                  <Button
                    size="lg"
                    onClick={() => navigate(`/events`)}
                    className="shadow-[8px_8px_0px_0px_hsl(var(--foreground))] w-full sm:w-auto"
                  >
                    Browse events
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate(`/forms/${slug ?? ""}`)}
                    className="border-[3px] border-foreground shadow-[8px_8px_0px_0px_hsl(var(--foreground))] w-full sm:w-auto"
                  >
                    Back to form
                    <ArrowLeft className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FormSuccess;
