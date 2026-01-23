import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DndContext, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { toast } from "@/components/ui/sonner";
import { fetchFormBySlug, submitFormResponse, type FormSchemaField } from "@/services/formService";

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
      className={`neo-card bg-muted px-4 py-3 border-[3px] border-foreground flex items-center gap-3 transition-transform ${
        isDragging ? "opacity-80 scale-[0.98] shadow-[6px_6px_0px_0px_hsl(var(--foreground))]" : "hover:-translate-y-[2px]"
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

const FormDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: form, isLoading } = useQuery({
    queryKey: ["form", slug],
    queryFn: () => fetchFormBySlug(slug!),
    enabled: !!slug,
  });

  const fields = (form?.schema?.fields ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

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
      });
      return changed ? next : prev;
    });
  }, [form]);

  const updateAnswer = (key: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const validateField = (field: FormSchemaField, value: unknown): string | null => {
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

    const textValue = typeof value === "string" ? value.trim() : "";
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

    const newErrors: Record<string, string> = {};
    const payload: Record<string, unknown> = {};

    fields.forEach((field) => {
      const value = answers[field.key];
      const error = validateField(field, value);
      if (error) newErrors[field.key] = error;

      if (field.type === "multi_select" && field.is_ranked) {
        payload[field.key] = Array.isArray(value) ? value : [];
      } else {
        payload[field.key] = value ?? (field.type === "multi_select" ? [] : "");
      }
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the highlighted fields and try again.");
      return;
    }

    try {
      setIsSubmitting(true);
      await submitFormResponse(form.id, payload, fields);
      toast.success("Thanks! Your response has been recorded.");
      setAnswers({});
      navigate("/");
    } catch (error) {
      if (error instanceof Error && error.message === "DUPLICATE_EMAIL") {
        toast.error("This email has already been registered for this event.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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

  return (
    <Layout>
      <SEO title={form.title} />
      <section className="relative bg-secondary overflow-hidden py-14 md:py-20">
        <div className="absolute inset-0 pointer-events-none uzbek-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <span className="neo-badge bg-background text-foreground mb-4 inline-block">Registration</span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">{form.title}</h1>
          <p className="font-body text-secondary-foreground/80 max-w-2xl">
            Please complete the form below to secure your spot. We will follow up by email if needed.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSubmit} className="neo-card bg-card p-6 md:p-10 space-y-8">
            {fields.map((field) => {
              const error = errors[field.key];
              const baseInputClass =
                "w-full rounded-md border-[3px] border-foreground bg-background px-4 py-3 font-body text-base shadow-[4px_4px_0px_0px_hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-foreground";

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
                          className={`neo-card bg-muted px-4 py-3 border-[3px] border-foreground flex items-center gap-3 cursor-pointer ${
                            selected.includes(option) ? "bg-secondary" : ""
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

              const value = (answers[field.key] as string) ?? "";
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
                      onChange={(e) => updateAnswer(field.key, e.target.value)}
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

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </Button>
              <span className="font-body text-sm text-muted-foreground">
                Your information is stored securely and only used for event coordination.
              </span>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default FormDetail;
