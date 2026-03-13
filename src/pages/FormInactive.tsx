import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CircleOff, Clock } from "lucide-react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { fetchFormBySlug } from "@/services/formService";

interface LocationState {
  formTitle?: string;
}

const FormInactive = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const { state } = useLocation();
  const { formTitle } = (state as LocationState) || {};

  const { data: form, isLoading } = useQuery({
    queryKey: ["form-inactive", slug],
    queryFn: () => fetchFormBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!form && !formTitle) {
    return (
      <Layout>
        <SEO title="Form Not Found" />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 font-display text-4xl font-bold">Form Not Found</h1>
          <p className="mb-8 font-body text-muted-foreground">
            The form you are looking for is not available.
          </p>
          <Button onClick={() => navigate("/events")}>Back to Events</Button>
        </div>
      </Layout>
    );
  }

  if (form?.is_active) {
    if (form.is_full) {
      return <Navigate to={`/forms/${slug}/filled`} replace />;
    }

    return <Navigate to={`/forms/${slug}`} replace />;
  }

  const displayTitle = formTitle || form?.title || "Form Unavailable";

  return (
    <Layout>
      <SEO title={`${displayTitle} — Registration Closed`} />
      <section className="relative overflow-hidden bg-secondary py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none uzbek-pattern opacity-15" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="neo-card bg-card px-6 py-10 text-center shadow-[14px_14px_0px_0px_hsl(var(--foreground))] md:px-10 md:py-14">
              <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl border-[5px] border-foreground bg-muted shadow-[10px_10px_0px_0px_hsl(var(--foreground))]">
                <CircleOff className="h-10 w-10" />
              </div>

              <span className="neo-badge mb-4 inline-flex bg-background text-foreground">Form Inactive</span>

              <h1 className="mb-4 font-display text-4xl font-black md:text-5xl">{displayTitle}</h1>
              <p className="mx-auto max-w-2xl font-body text-base text-foreground/80 md:text-lg">
                This form is currently inactive, so new submissions are turned off for now.
              </p>

              <div className="mt-8 grid gap-3 md:grid-cols-2">
                <div className="flex items-center justify-center gap-2 rounded-xl border-[3px] border-foreground bg-muted px-4 py-3 shadow-[6px_6px_0px_0px_hsl(var(--foreground))]">
                  <CircleOff className="h-4 w-4" />
                  <span className="font-body text-sm md:text-base">Registration is not open right now</span>
                </div>
                <div className="flex items-center justify-center gap-2 rounded-xl border-[3px] border-foreground bg-muted px-4 py-3 shadow-[6px_6px_0px_0px_hsl(var(--foreground))]">
                  <Clock className="h-4 w-4" />
                  <span className="font-body text-sm md:text-base">Check back later if the organizers reopen it</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate("/events")}
                  className="w-full shadow-[8px_8px_0px_0px_hsl(var(--foreground))] sm:w-auto"
                >
                  Browse events
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(-1)}
                  className="w-full border-[3px] border-foreground shadow-[8px_8px_0px_0px_hsl(var(--foreground))] sm:w-auto"
                >
                  Go back
                  <ArrowLeft className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FormInactive;
