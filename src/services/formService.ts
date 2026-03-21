import { supabase } from "@/lib/supabase";

export type UploadedImageAnswer = {
  url: string;
  path: string | null;
};

export type FormSchemaFieldType =
  | "text"
  | "email"
  | "multi_select"
  | "textarea"
  | "select"
  | "rating"
  | "boolean"
  | "image"
  | "content";

export interface FormSchemaField {
  id: string;
  key: string;
  type: FormSchemaFieldType;
  label: string;
  order?: number;
  required?: boolean;
  is_secure?: boolean;
  content_html?: string;
  max_count?: number;
  min_count?: number;
  options?: string[];
  is_ranked?: boolean;
  scale_min?: number;
  scale_max?: number;
  scale_type?: "stars" | "numeric";
  allow_float?: boolean;
  min_label?: string;
  max_label?: string;
  is_student_email?: boolean;
  conditional?: {
    option: string;
    field_key: string;
  };
}

export interface FormSchema {
  fields: FormSchemaField[];
}

export interface Form {
  id: number;
  title: string;
  slug: string;
  is_active: boolean;
  schema: FormSchema;
  event_id: number | null;
  max_response: number | null;
  response_count: number;
  is_full: boolean;
  created_at: string;
}

interface DbForm {
  id: number;
  title: string;
  slug: string;
  is_active: boolean;
  schema: FormSchema;
  event_id: number | null;
  max_response: number | null;
  created_at: string;
}

export const isAnswerableFormField = (field: FormSchemaField) => field.type !== "content";

const getFormImagesBucket = () => {
  const configuredBucket = import.meta.env.NEXT_PUBLIC_SUPABASE_FORM_IMAGES_BUCKET;
  return typeof configuredBucket === "string" && configuredBucket.trim().length > 0
    ? configuredBucket.trim()
    : "form-images";
};

const sanitizePathSegment = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "image";

const buildFormImagePath = (formId: number, fieldKey: string, fileName: string) => {
  const extension = fileName.includes(".") ? fileName.split(".").pop()?.toLowerCase() ?? "jpg" : "jpg";
  const safeFieldKey = sanitizePathSegment(fieldKey);
  const uniqueId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`;
  return `forms/${formId}/${safeFieldKey}/${uniqueId}.${extension}`;
};

const fetchFormResponseCount = async (formId: number) => {
  const { count, error } = await supabase
    .from("form_submissions")
    .select("id", { count: "exact", head: true })
    .eq("form_id", formId);

  if (error) {
    console.error("Error fetching form response count:", error);
    throw error;
  }

  return count ?? 0;
};

const mapDbFormToForm = (dbForm: DbForm, responseCount: number): Form => ({
  id: dbForm.id,
  title: dbForm.title,
  slug: dbForm.slug,
  is_active: dbForm.is_active,
  schema: dbForm.schema,
  event_id: dbForm.event_id,
  max_response: dbForm.max_response,
  response_count: responseCount,
  is_full: dbForm.max_response !== null && responseCount >= dbForm.max_response,
  created_at: dbForm.created_at,
});

const buildFormWithCapacity = async (dbForm: DbForm) => {
  const responseCount = await fetchFormResponseCount(dbForm.id);
  return mapDbFormToForm(dbForm, responseCount);
};

export const fetchActiveFormByEventId = async (eventId: number): Promise<Form | null> => {
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("event_id", eventId)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching active form:", error);
    throw error;
  }

  if (!data) return null;
  return buildFormWithCapacity(data as DbForm);
};

export const fetchFormBySlug = async (slug: string): Promise<Form | null> => {
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching form by slug:", error);
    return null;
  }

  if (!data) return null;
  return buildFormWithCapacity(data as DbForm);
};

export const uploadFormImage = async (
  formId: number,
  fieldKey: string,
  file: File
): Promise<UploadedImageAnswer> => {
  const bucket = getFormImagesBucket();
  const objectPath = buildFormImagePath(formId, fieldKey, file.name);

  const { error: uploadError } = await supabase.storage.from(bucket).upload(objectPath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });

  if (uploadError) {
    console.error("Error uploading form image:", uploadError);
    throw new Error("FORM_IMAGE_UPLOAD_FAILED");
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  if (!data.publicUrl) {
    throw new Error("FORM_IMAGE_UPLOAD_FAILED");
  }

  return {
    url: data.publicUrl,
    path: objectPath,
  };
};

const assertFormAcceptingResponses = async (formId: number) => {
  const [{ data, error }, responseCount] = await Promise.all([
    supabase
      .from("forms")
      .select("is_active, max_response")
      .eq("id", formId)
      .maybeSingle(),
    fetchFormResponseCount(formId),
  ]);

  if (error) {
    console.error("Error fetching form capacity:", error);
    throw error;
  }

  const form = data as { is_active: boolean; max_response: number | null } | null;

  if (form && !form.is_active) {
    throw new Error("FORM_INACTIVE");
  }

  const maxResponse = form?.max_response ?? null;
  if (maxResponse !== null && responseCount >= maxResponse) {
    throw new Error("FORM_FULL");
  }
};

const extractEmail = (answers: Record<string, unknown>, fields: FormSchemaField[]) => {
  const emailField = fields.find((field) => field.type === "email");
  const key = emailField?.key ?? "email";
  const raw = answers[key];
  const value = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  return { key, value };
};

export const submitFormResponse = async (
  formId: number,
  answers: Record<string, unknown>,
  fields: FormSchemaField[]
) => {
  await assertFormAcceptingResponses(formId);

  const emailInfo = extractEmail(answers, fields);
  if (emailInfo.value) {
    const { data, error } = await supabase
      .from("form_submissions")
      .select("id")
      .eq("form_id", formId)
      .eq(`answers->>${emailInfo.key}`, emailInfo.value)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error checking existing submission:", error);
      throw error;
    }

    if (data) {
      throw new Error("DUPLICATE_EMAIL");
    }
  }

  const { error } = await supabase
    .from("form_submissions")
    .insert({
      form_id: formId,
      status: "submitted",
      answers,
    });

  if (error) {
    console.error("Error submitting form response:", error);
    throw error;
  }
};
