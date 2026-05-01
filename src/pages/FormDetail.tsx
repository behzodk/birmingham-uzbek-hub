import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DndContext, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronDown, Star } from "lucide-react";
import { FormEventContext } from "@/components/forms/FormEventContext";
import { FormPartners } from "@/components/forms/FormPartners";
import { FormContentBlock } from "@/components/forms/FormContentBlock";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { toast } from "@/components/ui/sonner";
import {
  fetchFormBySlug,
  isAnswerableFormField,
  submitFormResponse,
  uploadFormImage,
  type FormSchemaField,
  type UploadedImageAnswer,
} from "@/services/formService";

const RankedOptionItem = ({
  id,
  label,
  rank,
}: {
  id: string;
  label: string;
  rank: number;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`neo-card bg-muted px-4 py-3 border-[3px] border-foreground flex items-center gap-3 transition-transform ${isDragging ? "opacity-80 scale-[0.98] shadow-[6px_6px_0px_0px_hsl(var(--foreground))]" : "hover:-translate-y-[2px]"
        }`}
      {...attributes}
      {...listeners}
    >
      <span className="neo-badge bg-background text-foreground text-xs">{rank}</span>
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border-[2px] border-foreground bg-background text-foreground/70">
        <GripVertical className="h-4 w-4" />
      </span>
      <span className="font-body text-sm md:text-base">{label}</span>
    </div>
  );
};

type ImageFieldSelection = {
  file: File;
  fileName: string;
  previewUrl: string;
};

const isUploadedImageAnswer = (value: unknown): value is UploadedImageAnswer => {
  if (!value || typeof value !== "object") return false;

  const candidate = value as UploadedImageAnswer;
  return typeof candidate.url === "string";
};

const FormDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [imageSelections, setImageSelections] = useState<Record<string, ImageFieldSelection>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImageKeys, setUploadingImageKeys] = useState<string[]>([]);
  const imageSelectionsRef = useRef(imageSelections);

  const { data: form, isLoading, isFetching, isFetchedAfterMount } = useQuery({
    queryKey: ["form", slug],
    queryFn: () => fetchFormBySlug(slug!),
    enabled: !!slug,
    refetchOnMount: "always",
  });

  const fields = (form?.schema?.fields ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  useEffect(() => {
    imageSelectionsRef.current = imageSelections;
  }, [imageSelections]);

  const isFieldVisible = (field: FormSchemaField) => {
    if (!field.conditional) return true;
    const targetValue = answers[field.conditional.field_key];
    if (typeof targetValue === "string") {
      return targetValue.trim() === field.conditional.option;
    }
    return targetValue === field.conditional.option;
  };

  useEffect(() => {
    return () => {
      Object.values(imageSelectionsRef.current).forEach((selection) => {
        URL.revokeObjectURL(selection.previewUrl);
      });
    };
  }, []);

  useEffect(() => {
    if (!form) return;
    setAnswers((prev) => {
      let changed = false;
      const next = { ...prev };
      form.schema.fields.forEach((field) => {
        if (field.type === "multi_select" && field.is_ranked) {
          if (!Array.isArray(prev[field.key])) {
            next[field.key] = field.options ?? [];
            changed = true;
          }
        }
        if (field.type === "select") {
          const current = prev[field.key];
          if (typeof current !== "string") {
            next[field.key] = "";
            changed = true;
          }
        }
      });
      return changed ? next : prev;
    });
  }, [form]);

  const updateAnswer = (key: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const clearFieldError = (key: string) => {
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const setImageSelection = (fieldKey: string, file: File | null) => {
    setImageSelections((prev) => {
      const current = prev[fieldKey];
      if (current?.previewUrl) {
        URL.revokeObjectURL(current.previewUrl);
      }

      if (!file) {
        const next = { ...prev };
        delete next[fieldKey];
        return next;
      }

      return {
        ...prev,
        [fieldKey]: {
          file,
          fileName: file.name,
          previewUrl: URL.createObjectURL(file),
        },
      };
    });
    clearFieldError(fieldKey);
  };

  const handleImageSelection = (field: FormSchemaField, file: File | null) => {
    if (!file) {
      setImageSelection(field.key, null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageSelection(field.key, null);
      setErrors((prev) => ({
        ...prev,
        [field.key]: "Please choose an image file.",
      }));
      toast.error("Please choose an image file.");
      return;
    }

    setImageSelection(field.key, file);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const validateField = (field: FormSchemaField, value: unknown): string | null => {
    if (field.type === "content") {
      return null;
    }

    if (field.type === "image") {
      const selectedImage = imageSelections[field.key];
      const hasUploadedValue =
        isUploadedImageAnswer(value)
          ? value.url.trim().length > 0
          : typeof value === "string"
            ? value.trim().length > 0
            : false;

      if (field.required && !selectedImage?.file && !hasUploadedValue) {
        return "Please upload an image.";
      }

      return null;
    }

    if (field.type === "multi_select") {
      if (field.is_ranked) {
        const ranked = Array.isArray(value) ? value : [];
        const count = ranked.length;
        if (field.required && count === 0) return "Please rank at least one option.";
        if (field.min_count !== undefined && count < field.min_count) {
          return `Please rank at least ${field.min_count} option(s).`;
        }
        if (field.max_count !== undefined && count > field.max_count) {
          return `Please rank no more than ${field.max_count} option(s).`;
        }
        return null;
      }

      const selected = Array.isArray(value) ? value : [];
      if (field.required && selected.length === 0) return "Please select at least one option.";
      if (field.min_count !== undefined && selected.length < field.min_count) {
        return `Please select at least ${field.min_count} option(s).`;
      }
      if (field.max_count !== undefined && selected.length > field.max_count) {
        return `Please select no more than ${field.max_count} option(s).`;
      }
      return null;
    }

    if (field.type === "rating") {
      const min = field.scale_min ?? 1;
      const max = field.scale_max ?? 5;
      const rating = typeof value === "number" ? value : null;
      if (field.required && (rating === null || Number.isNaN(rating))) {
        return "Please provide a rating.";
      }
      if (rating !== null && (rating < min || rating > max)) {
        return `Please rate between ${min} and ${max}.`;
      }
      if (!field.allow_float && rating !== null && !Number.isInteger(rating)) {
        return "Please select a whole-number rating.";
      }
      return null;
    }

    if (field.type === "boolean") {
      const isChecked = value === true;
      if (field.required && !isChecked) return "This field is required.";
      return null;
    }

    if (field.type === "select") {
      const selected = typeof value === "string" ? value.trim() : "";
      if (field.required && selected.length === 0) return "Please select an option.";
      if (selected && field.options && field.options.length > 0 && !field.options.includes(selected)) {
        return "Please choose a valid option.";
      }
      return null;
    }

    const textValue = typeof value === "string" ? value.trim() : "";
    if (field.type === "email") {
      if (field.required && textValue.length === 0) return "Email is required.";
      if (field.is_student_email) {
        if (textValue.includes("@")) return "Please enter your username only.";
        return null;
      }
      if (textValue && !textValue.toLowerCase().endsWith("@student.bham.ac.uk")) {
        return "Use your @student.bham.ac.uk email address.";
      }
    }
    if (field.required && textValue.length === 0) return "This field is required.";
    if (field.min_count !== undefined && textValue.length < field.min_count) {
      return `Minimum ${field.min_count} characters required.`;
    }
    if (field.max_count !== undefined && textValue.length > field.max_count) {
      return `Maximum ${field.max_count} characters allowed.`;
    }
    return null;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form) return;

    const visibleFields = fields.filter(isFieldVisible);
    const answerableVisibleFields = visibleFields.filter(isAnswerableFormField);
    const newErrors: Record<string, string> = {};

    answerableVisibleFields.forEach((field) => {
      const value = answers[field.key];
      const error = validateField(field, value);
      if (error) newErrors[field.key] = error;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the highlighted fields and try again.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: Record<string, unknown> = {};

      for (const field of answerableVisibleFields) {
        const value = answers[field.key];

        if (field.type === "image") {
          const selectedImage = imageSelections[field.key];

          if (selectedImage?.file) {
            setUploadingImageKeys((prev) => [...prev, field.key]);

            try {
              payload[field.key] = await uploadFormImage(form.id, field.key, selectedImage.file);
            } catch (error) {
              console.error("Error uploading form image:", error);
              setErrors((prev) => ({
                ...prev,
                [field.key]: "We couldn't upload this image. Please try again.",
              }));
              toast.error(`We couldn't upload ${field.label}. Please try again.`);
              return;
            } finally {
              setUploadingImageKeys((prev) => prev.filter((key) => key !== field.key));
            }
          } else if (isUploadedImageAnswer(value)) {
            payload[field.key] = value;
          } else if (typeof value === "string" && value.trim().length > 0) {
            payload[field.key] = value.trim();
          } else {
            payload[field.key] = null;
          }

          continue;
        }

        if (field.type === "multi_select" && field.is_ranked) {
          payload[field.key] = Array.isArray(value) ? value : [];
        } else if (field.type === "email" && field.is_student_email) {
          const username = typeof value === "string" ? value.trim() : "";
          payload[field.key] = username ? `${username}@student.bham.ac.uk` : "";
        } else {
          payload[field.key] = value ?? (field.type === "multi_select" ? [] : "");
        }
      }

      await submitFormResponse(form.id, payload, answerableVisibleFields);
      toast.success("Thanks! Your response has been recorded.");
      navigate(`/forms/${slug}/success`, {
        state: {
          formTitle: form.title,
          submittedAt: new Date().toISOString(),
        },
        replace: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "DUPLICATE_EMAIL") {
          toast.error("This email has already been registered for this event.");
        } else if (error.message === "FORM_INACTIVE") {
          toast.error("This form is not accepting responses right now.");
          navigate(`/forms/${slug}/inactive`, {
            state: {
              formTitle: form.title,
            },
            replace: true,
          });
        } else if (error.message === "FORM_FULL") {
          toast.error("This form is no longer accepting responses.");
          navigate(`/forms/${slug}/filled`, {
            state: {
              formTitle: form.title,
              maxResponse: form.max_response,
            },
            replace: true,
          });
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setUploadingImageKeys([]);
      setIsSubmitting(false);
    }
  };

  if (isLoading || (isFetching && !isFetchedAfterMount)) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!form) {
    return (
      <Layout>
        <SEO title="Form Not Found" />
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
          <h1 className="font-display text-4xl font-bold mb-4">Form Not Found</h1>
          <p className="font-body text-muted-foreground mb-8">
            The form you are looking for is not available.
          </p>
          <Button asChild>
            <Link to="/events">Back to Events</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (!form.is_active) {
    return (
      <Navigate
        to={`/forms/${slug}/inactive`}
        replace
        state={{
          formTitle: form.title,
        }}
      />
    );
  }

  if (form.is_full) {
    return (
      <Navigate
        to={`/forms/${slug}/filled`}
        replace
        state={{
          formTitle: form.title,
          maxResponse: form.max_response,
        }}
      />
    );
  }

  return (
    <Layout>
      <SEO title={form.title} />
      <section className="relative bg-secondary overflow-hidden py-14 md:py-20">
        <div className="absolute inset-0 pointer-events-none uzbek-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,26rem)] lg:items-center lg:gap-10">
            <div className="max-w-3xl">
              <span className="neo-badge bg-background text-foreground mb-4 inline-block">Registration</span>
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">{form.title}</h1>
              <p className="font-body text-secondary-foreground/80 max-w-2xl">
                Please complete the form below to secure your spot. We will follow up by email if needed.
              </p>
            </div>

            <FormPartners partners={form.partners} className="lg:justify-self-end" />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto space-y-8 px-4">
          <FormEventContext eventId={form.event_id} />

          <form onSubmit={handleSubmit} className="neo-card bg-card p-6 md:p-10 space-y-8">
            {fields.filter(isFieldVisible).map((field) => {
              const error = errors[field.key];
              const baseInputClass =
                "w-full rounded-md border-[3px] border-foreground bg-background px-4 py-3 font-body text-base shadow-[4px_4px_0px_0px_hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-foreground";

              if (field.type === "content") {
                return <FormContentBlock key={field.id} field={field} />;
              }

              if (field.type === "multi_select" && field.is_ranked) {
                const options = field.options ?? [];
                const currentOrder = Array.isArray(answers[field.key])
                  ? (answers[field.key] as string[])
                  : [];
                const orderedOptions = currentOrder.filter((option) => options.includes(option));
                const availableOptions = options.filter((option) => !orderedOptions.includes(option));
                const finalOrder = [...orderedOptions, ...availableOptions];
                return (
                  <div key={field.id} className="space-y-4">
                    <div>
                      <label className="font-display text-lg font-bold">{field.label}</label>
                      {field.required && <span className="ml-2 text-sm text-destructive">*</span>}
                      <p className="font-body text-sm text-muted-foreground mt-1">
                        Drag to reorder. The top item is ranked highest.
                      </p>
                    </div>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragStart={() => {
                        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                          navigator.vibrate(10);
                        }
                      }}
                      onDragEnd={(event) => {
                        const { active, over } = event;
                        if (!over || active.id === over.id) return;
                        const oldIndex = finalOrder.indexOf(active.id as string);
                        const newIndex = finalOrder.indexOf(over.id as string);
                        if (oldIndex === -1 || newIndex === -1) return;
                        const nextOrder = arrayMove(finalOrder, oldIndex, newIndex);
                        updateAnswer(field.key, nextOrder);
                      }}
                    >
                      <SortableContext items={finalOrder} strategy={verticalListSortingStrategy}>
                        <div className="space-y-3">
                          {finalOrder.map((option, index) => (
                            <RankedOptionItem key={option} id={option} label={option} rank={index + 1} />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                    {error && <p className="text-sm text-destructive font-body">{error}</p>}
                  </div>
                );
              }

              if (field.type === "select") {
                const value = (answers[field.key] as string) ?? "";
                const options = field.options ?? [];
                return (
                  <div key={field.id} className="space-y-3">
                    <div>
                      <label className="font-display text-lg font-bold">{field.label}</label>
                      {field.required && <span className="ml-2 text-sm text-destructive">*</span>}
                    </div>
                    <div className="relative">
                      <select
                        className={`${baseInputClass} min-h-[48px] pr-12 appearance-none cursor-pointer bg-background`}
                        value={value}
                        onChange={(e) => updateAnswer(field.key, e.target.value)}
                        required={field.required}
                      >
                        <option value="" disabled>
                          Select an option
                        </option>
                        {options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/70" />
                    </div>
                    {error && <p className="text-sm text-destructive font-body">{error}</p>}
                  </div>
                );
              }

              if (field.type === "rating") {
                const min = field.scale_min ?? 1;
                const max = field.scale_max ?? 5;
                const step = field.allow_float ? 0.5 : 1;
                const scaleType = field.scale_type?.toLowerCase() === "numeric" ? "numeric" : "stars";
                const value = typeof answers[field.key] === "number" ? (answers[field.key] as number) : null;
                const starCount = max - min + 1;
                const starLayoutClass =
                  starCount > 7 ? "grid grid-cols-5 sm:grid-cols-10 gap-2" : "flex flex-wrap items-center gap-2";

                return (
                  <div key={field.id} className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <label className="font-display text-lg font-bold">{field.label}</label>
                        {field.required && <span className="ml-2 text-sm text-destructive">*</span>}
                      </div>
                      <div className="flex items-center gap-3 text-sm font-body text-muted-foreground">
                        {field.min_label && <span>{field.min_label}</span>}
                        {(field.min_label || field.max_label) && <span className="h-px w-8 bg-border" aria-hidden />}
                        {field.max_label && <span>{field.max_label}</span>}
                      </div>
                    </div>

                    {scaleType === "stars" ? (
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className={starLayoutClass}>
                          {Array.from({ length: max - min + 1 }, (_, idx) => {
                            const score = min + idx;
                            const isActive = value !== null && score <= value;
                            return (
                              <button
                                key={score}
                                type="button"
                                className={`p-2 rounded-md border-[2px] border-foreground bg-background shadow-[3px_3px_0_0_hsl(var(--foreground))] transition-transform hover:-translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-foreground ${isActive ? "bg-secondary text-foreground" : "text-foreground/60"
                                  }`}
                                onClick={() => updateAnswer(field.key, score)}
                                aria-label={`Rate ${score} out of ${max}`}
                              >
                                <Star
                                  className="h-6 w-6"
                                  fill={isActive ? "currentColor" : "none"}
                                />
                              </button>
                            );
                          })}
                        </div>
                        <div className="neo-card bg-muted border-[3px] border-foreground px-3 py-2 text-sm font-body">
                          {value ? `Selected: ${value}/${max}` : "No rating yet"}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <input
                          type="range"
                          min={min}
                          max={max}
                          step={step}
                          value={value ?? min}
                          onChange={(e) => updateAnswer(field.key, Number(e.target.value))}
                          className="w-full accent-foreground"
                        />
                        <div className="flex items-center justify-between text-sm font-body text-muted-foreground">
                          <span>{min}</span>
                          <span className="neo-badge bg-background text-foreground">
                            {value ?? "Not rated"} / {max}
                          </span>
                        </div>
                      </div>
                    )}

                    {error && <p className="text-sm text-destructive font-body">{error}</p>}
                  </div>
                );
              }

              if (field.type === "image") {
                const imageSelection = imageSelections[field.key];
                const isUploadingImage = uploadingImageKeys.includes(field.key);

                return (
                  <div key={field.id} className="space-y-4">
                    <div>
                      <label htmlFor={`field-${field.id}`} className="font-display text-lg font-bold">
                        {field.label}
                      </label>
                      {field.required && <span className="ml-2 text-sm text-destructive">*</span>}
                    </div>

                    <div className="neo-card bg-muted p-4 md:p-5">
                      <div className="space-y-4">
                        <input
                          id={`field-${field.id}`}
                          type="file"
                          accept="image/*"
                          className={`${baseInputClass} cursor-pointer file:mr-4 file:border-0 file:bg-secondary file:px-4 file:py-3 file:font-display file:text-sm file:font-bold file:uppercase file:tracking-wide file:text-secondary-foreground`}
                          onChange={(event) => {
                            const file = event.target.files?.[0] ?? null;
                            handleImageSelection(field, file);
                            event.currentTarget.value = "";
                          }}
                        />

                        <div className="space-y-2">
                          <p className="font-body text-sm text-muted-foreground">
                            {imageSelection?.fileName
                              ? `Selected image: ${imageSelection.fileName}`
                              : "Choose an image file from your device."}
                          </p>
                          {imageSelection?.fileName ? (
                            <p className="font-body text-sm text-foreground/80">
                              Choose another image any time before submitting to replace it.
                            </p>
                          ) : null}
                          {isUploadingImage ? (
                            <p className="font-body text-sm font-semibold text-foreground/80">Uploading image...</p>
                          ) : null}
                        </div>

                        {imageSelection?.previewUrl ? (
                          <div className="neo-card max-w-sm overflow-hidden bg-card">
                            <img
                              src={imageSelection.previewUrl}
                              alt={`${field.label} preview`}
                              className="h-auto w-full object-cover"
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {error && <p className="text-sm text-destructive font-body">{error}</p>}
                  </div>
                );
              }

              if (field.type === "multi_select") {
                const selected = (answers[field.key] as string[]) || [];
                const options = field.options ?? [];
                return (
                  <div key={field.id} className="space-y-4">
                    <div>
                      <label className="font-display text-lg font-bold">{field.label}</label>
                      {field.required && <span className="ml-2 text-sm text-destructive">*</span>}
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {options.map((option) => (
                        <label
                          key={option}
                          className={`neo-card bg-muted px-4 py-3 border-[3px] border-foreground flex items-center gap-3 cursor-pointer ${selected.includes(option) ? "bg-secondary" : ""
                            }`}
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-foreground"
                            checked={selected.includes(option)}
                            onChange={() => {
                              const next = selected.includes(option)
                                ? selected.filter((item) => item !== option)
                                : [...selected, option];
                              updateAnswer(field.key, next);
                            }}
                          />
                          <span className="font-body text-sm md:text-base">{option}</span>
                        </label>
                      ))}
                    </div>
                    {error && <p className="text-sm text-destructive font-body">{error}</p>}
                  </div>
                );
              }

              if (field.type === "boolean") {
                const value = (answers[field.key] as boolean) ?? false;
                return (
                  <div key={field.id} className="space-y-4">
                    <label
                      className={`neo-card bg-muted px-4 py-3 border-[3px] border-foreground flex items-center gap-3 cursor-pointer ${value ? "bg-secondary" : ""
                        }`}
                    >
                      <input
                        type="checkbox"
                        className="h-5 w-5 accent-foreground"
                        checked={value}
                        onChange={(e) => updateAnswer(field.key, e.target.checked)}
                        required={field.required}
                      />
                      <div className="flex flex-col">
                        <span className="font-display text-lg font-bold">{field.label}</span>
                        {field.required && <span className="text-xs text-destructive">* Required</span>}
                      </div>
                    </label>
                    {error && <p className="text-sm text-destructive font-body">{error}</p>}
                  </div>
                );
              }
              const value = (answers[field.key] as string) ?? "";

              if (field.type === "email" && field.is_student_email) {
                return (
                  <div key={field.id} className="space-y-3">
                    <div>
                      <label className="font-display text-lg font-bold">{field.label}</label>
                      {field.required && <span className="ml-2 text-sm text-destructive">*</span>}
                    </div>
                    <div className="flex items-center w-full rounded-md border-[3px] border-foreground bg-background shadow-[4px_4px_0px_0px_hsl(var(--foreground))] focus-within:ring-2 focus-within:ring-foreground overflow-hidden">
                      <input
                        type="text"
                        className="flex-1 bg-background px-4 py-3 font-body text-base focus:outline-none placeholder:text-muted-foreground min-w-0"
                        value={value}
                        onChange={(e) => {
                          const val = e.target.value.replace(/@/g, "");
                          updateAnswer(field.key, val);
                        }}
                        maxLength={field.max_count}
                        minLength={field.min_count}
                        required={field.required}
                        placeholder="username"
                      />
                      <div className="bg-muted px-3 md:px-4 py-3 border-l-[3px] border-foreground font-body text-sm md:text-base text-muted-foreground whitespace-nowrap h-full flex items-center">
                        @student.bham.ac.uk
                      </div>
                    </div>
                    {error && <p className="text-sm text-destructive font-body">{error}</p>}
                  </div>
                );
              }
              return (
                <div key={field.id} className="space-y-3">
                  <div>
                    <label className="font-display text-lg font-bold">{field.label}</label>
                    {field.required && <span className="ml-2 text-sm text-destructive">*</span>}
                  </div>
                  {field.type === "textarea" ? (
                    <textarea
                      className={baseInputClass}
                      rows={4}
                      value={value}
                      onChange={(e) => updateAnswer(field.key, e.target.value)}
                      maxLength={field.max_count}
                      minLength={field.min_count}
                      required={field.required}
                      placeholder={field.label}
                    />
                  ) : (
                    <input
                      type={field.type === "email" ? "email" : "text"}
                      className={baseInputClass}
                      value={value}
                      onChange={(e) =>
                        updateAnswer(
                          field.key,
                          field.type === "email" ? e.target.value.toLowerCase().trim() : e.target.value
                        )
                      }
                      maxLength={field.max_count}
                      minLength={field.min_count}
                      required={field.required}
                      placeholder={field.label}
                    />
                  )}
                  {error && <p className="text-sm text-destructive font-body">{error}</p>}
                </div>
              );
            })}

            <p className="font-body text-sm text-muted-foreground">
              By submitting, you agree to our{" "}
              <Link to="/privacy" className="underline font-semibold hover:text-foreground">
                Privacy Policy
              </Link>
              .
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Button type="submit" size="lg" disabled={isSubmitting || uploadingImageKeys.length > 0}>
                {uploadingImageKeys.length > 0
                  ? "Uploading images..."
                  : isSubmitting
                    ? "Submitting..."
                    : "Submit Registration"}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default FormDetail;
