import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ImagePlus, Upload, UserRound } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { getCompetitionEntryLabel, isCompetitionRegistrationOpen } from "@/lib/competition";
import { createPublicCompetitionEntry, fetchPublicCompetitionBySlug } from "@/services/competitionService";

const CompetitionRegister = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [entryName, setEntryName] = useState("");
  const [competitorName, setCompetitorName] = useState("");
  const [entryDescription, setEntryDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: competition, isLoading } = useQuery({
    queryKey: ["public-competition-register", slug],
    queryFn: () => fetchPublicCompetitionBySlug(slug!),
    enabled: Boolean(slug),
  });

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

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
            This competition is not available for public registration.
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

  const entryLabel = getCompetitionEntryLabel(competition);
  const registrationOpen = isCompetitionRegistrationOpen(competition);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!entryName.trim()) {
      nextErrors.entryName = `${entryLabel} name is required.`;
    }

    if (!competitorName.trim()) {
      nextErrors.competitorName = "Competitor name is required.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!registrationOpen || isSubmitting) {
      return;
    }

    const nextErrors = validate();
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please complete the required fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await createPublicCompetitionEntry({
        competitionId: competition.id,
        competitorName: competitorName.trim(),
        entryName: entryName.trim(),
        entryDescription: entryDescription.trim() || null,
        imageFile,
      });

      toast.success(`${entryLabel} registered successfully.`);
      navigate(`/competitions/${competition.slug}/registered/${result.ratingPublicId}`);
    } catch (error) {
      const message =
        error instanceof Error && error.message === "ENTRY_IMAGE_UPLOAD_FAILED"
          ? "We couldn't upload your image. Please try again or submit without an image."
          : `We couldn't submit your ${entryLabel.toLowerCase()} right now. Please try again.`;

      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO
        title={`Register for ${competition.title}`}
        description={`Submit a public ${entryLabel.toLowerCase()} for ${competition.title}.`}
        url={typeof window !== "undefined" ? window.location.href : undefined}
      />

      <section className="bg-primary py-14 text-primary-foreground md:py-20">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6 text-primary-foreground hover:bg-white/10"
            onClick={() => navigate(`/competitions/${competition.slug}`)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Competition
          </Button>
          <div className="max-w-4xl">
            <span className="neo-badge mb-4 inline-block bg-secondary text-secondary-foreground">
              Public {entryLabel} Registration
            </span>
            <h1 className="mb-4 text-4xl font-black sm:text-5xl">{competition.title}</h1>
            <p className="font-body text-lg text-primary-foreground/85">
              Register your {entryLabel.toLowerCase()} with a simple public form. Only the {entryLabel.toLowerCase()} name
              and competitor name are required.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              {!registrationOpen ? (
                <div className="neo-card bg-card p-8">
                  <h2 className="mb-3 text-3xl font-bold">Registration Closed</h2>
                  <p className="mb-4 font-body text-muted-foreground">
                    Public {entryLabel.toLowerCase()} registration is no longer available for this competition.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="neo-card bg-card p-6">
                    <h2 className="mb-4 text-2xl font-bold">Register Your {entryLabel}</h2>
                    <p className="font-body text-muted-foreground">
                      Public registration only collects the required {entryLabel.toLowerCase()} details. Email and phone are not requested on
                      this form.
                    </p>
                  </div>

                  {submitError ? (
                    <Alert variant="destructive" className="border-[3px] border-destructive bg-background">
                      <AlertTitle>{entryLabel} registration failed</AlertTitle>
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                  ) : null}

                  <div className="neo-card bg-card p-6">
                    <div className="grid gap-5">
                      <div className="space-y-2">
                        <label htmlFor="entryName" className="font-display text-sm uppercase tracking-wide">
                          {entryLabel} Name
                        </label>
                        <Input
                          id="entryName"
                          value={entryName}
                          onChange={(event) => {
                            setEntryName(event.target.value);
                            setErrors((current) => ({ ...current, entryName: "" }));
                          }}
                          className="border-[2px] border-foreground bg-background"
                          placeholder={`Enter your ${entryLabel.toLowerCase()} name`}
                          required
                        />
                        {errors.entryName ? <p className="text-sm font-medium text-destructive">{errors.entryName}</p> : null}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="competitorName" className="font-display text-sm uppercase tracking-wide">
                          Competitor(s) Name
                        </label>
                        <Input
                          id="competitorName"
                          value={competitorName}
                          onChange={(event) => {
                            setCompetitorName(event.target.value);
                            setErrors((current) => ({ ...current, competitorName: "" }));
                          }}
                          className="border-[2px] border-foreground bg-background"
                          placeholder="Enter the competitor(s) name"
                          required
                        />
                        {errors.competitorName ? (
                          <p className="text-sm font-medium text-destructive">{errors.competitorName}</p>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="entryDescription" className="font-display text-sm uppercase tracking-wide">
                          Description
                        </label>
                        <Textarea
                          id="entryDescription"
                          value={entryDescription}
                          onChange={(event) => setEntryDescription(event.target.value)}
                          className="min-h-[140px] border-[2px] border-foreground bg-background"
                          placeholder={`Optional description for your ${entryLabel.toLowerCase()}`}
                        />
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="entryImage" className="font-display text-sm uppercase tracking-wide">
                          {entryLabel} Image
                        </label>
                        <div className="neo-card bg-muted p-4">
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center border-[2px] border-foreground bg-background">
                                <ImagePlus className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-display text-base font-bold">Upload photo</p>
                              </div>
                            </div>
                            <Input
                              id="entryImage"
                              type="file"
                              accept="image/*"
                              className="border-[2px] border-foreground bg-background file:font-display file:font-bold"
                              onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                            />
                          </div>
                        </div>

                        {previewUrl ? (
                          <div className="neo-card max-w-md overflow-hidden bg-card">
                            <img src={previewUrl} alt={`${entryLabel} preview`} className="h-64 w-full object-cover" />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Upload className="h-4 w-4 animate-pulse" />
                        {imageFile ? `Uploading ${entryLabel} Image and Registering...` : `Registering ${entryLabel}...`}
                      </>
                    ) : (
                      `Register ${entryLabel}`
                    )}
                  </Button>
                </form>
              )}
            </div>

            <div className="space-y-6">
              <div className="neo-card bg-card p-6">
                <h2 className="mb-4 text-2xl font-bold">What happens next</h2>
                <div className="space-y-3 font-body text-sm text-foreground/85">
                  <p>1. Your {entryLabel.toLowerCase()} is created immediately as approved.</p>
                  <p>2. You are redirected to a success page with a QR code and public rating link.</p>
                  <p>3. Public rating access is ready right after registration.</p>
                </div>
              </div>

              <div className="neo-card bg-card p-6">
                <div className="mb-3 flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-primary" />
                  <h2 className="text-xl font-bold">Public Form Scope</h2>
                </div>
                <p className="font-body text-muted-foreground">
                  This public form only collects competitor name, {entryLabel.toLowerCase()} name, optional description,
                  and an optional uploaded image.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CompetitionRegister;
