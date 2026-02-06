import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";

interface LocationState {
  formTitle?: string;
  submittedAt?: string;
}

const FormSuccess = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { state } = useLocation();
  const { formTitle, submittedAt } = (state as LocationState) || {};

  const displayTitle = formTitle || "Registration Received";
  const submittedDate = submittedAt ? new Date(submittedAt).toLocaleString() : null;

  return (
    <Layout>
      <SEO title={`${displayTitle} — Success`} />
      <section className="relative overflow-hidden bg-secondary py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-24 -top-24 h-72 w-72 rotate-6 rounded-[32px] border-[6px] border-foreground bg-primary/60 shadow-[12px_12px_0px_0px_hsl(var(--foreground))]" />
          <div className="absolute -right-16 top-10 h-40 w-40 -rotate-3 rounded-[28px] border-[5px] border-foreground bg-background shadow-[10px_10px_0px_0px_hsl(var(--foreground))]" />
          <div className="absolute left-16 bottom-0 h-32 w-32 rotate-12 rounded-[24px] border-[5px] border-foreground bg-accent/60 shadow-[10px_10px_0px_0px_hsl(var(--foreground))]" />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border-[4px] border-foreground bg-background px-4 py-2 text-sm font-semibold uppercase tracking-tight shadow-[6px_6px_0px_0px_hsl(var(--foreground))]">
                <Sparkles className="h-4 w-4" />
                Submission success
              </div>

              <div className="flex items-center gap-4">
                <span className="grid h-16 w-16 place-items-center rounded-2xl border-[5px] border-foreground bg-primary text-background shadow-[10px_10px_0px_0px_hsl(var(--foreground))]">
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <div>
                  <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight drop-shadow-[6px_6px_0px_hsl(var(--foreground))]">
                    {displayTitle}
                  </h1>
                  <p className="font-body text-base text-secondary-foreground/80">
                    We captured your details and will be in touch. Meanwhile, explore what’s happening next.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border-[4px] border-foreground bg-card p-6 shadow-[10px_10px_0px_0px_hsl(var(--foreground))]">
                <h2 className="font-display text-xl font-bold mb-2">What happens now?</h2>
                <ul className="space-y-3 font-body text-base text-foreground/90 list-disc pl-6">
                  <li>You’ll receive a confirmation email if follow-up is needed.</li>
                  <li>Organizers review submissions and match roles within 48 hours.</li>
                  <li>Check the events page for schedules, themes, and prep materials.</li>
                </ul>
                {submittedDate && (
                  <p className="mt-4 text-sm text-muted-foreground">Submitted on {submittedDate}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={() => navigate(`/events`)} className="shadow-[6px_6px_0px_0px_hsl(var(--foreground))]">
                  Browse events
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(`/forms/${slug ?? ""}`)}
                  className="border-[3px] border-foreground shadow-[6px_6px_0px_0px_hsl(var(--foreground))]"
                >
                  Go back
                  <ArrowLeft className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative max-w-md w-full">
              <div className="absolute inset-0 -rotate-2 rounded-[28px] border-[5px] border-foreground bg-background shadow-[12px_12px_0px_0px_hsl(var(--foreground))]" />
              <div className="relative z-10 space-y-4 rounded-[24px] border-[4px] border-foreground bg-primary/90 p-8 text-background shadow-[12px_12px_0px_0px_hsl(var(--foreground))]">
                <p className="font-display text-2xl font-bold">You’re on the list.</p>
                <p className="font-body text-base leading-relaxed">
                  Thanks for stepping up. If you chose to debate, expect topic briefs soon. If you’re observing, we’ll share the best seats.
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border-[3px] border-background/80 bg-background/20 px-3 py-2">
                    <p className="font-semibold">Role Mix</p>
                    <p className="text-background/80">Debaters + observers</p>
                  </div>
                  <div className="rounded-lg border-[3px] border-background/80 bg-background/20 px-3 py-2">
                    <p className="font-semibold">Next Drop</p>
                    <p className="text-background/80">Schedule update in 48h</p>
                  </div>
                  <div className="rounded-lg border-[3px] border-background/80 bg-background/20 px-3 py-2">
                    <p className="font-semibold">Prep Kit</p>
                    <p className="text-background/80">Links & readings</p>
                  </div>
                  <div className="rounded-lg border-[3px] border-background/80 bg-background/20 px-3 py-2">
                    <p className="font-semibold">Contact</p>
                    <p className="text-background/80">hello@uzbekhub.org</p>
                  </div>
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
