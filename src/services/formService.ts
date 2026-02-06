import { supabase } from "@/lib/supabase";

export interface FormSchemaField {
  id: string;
  key: string;
  type: "text" | "email" | "multi_select" | "textarea" | "select";
  label: string;
  order?: number;
  required?: boolean;
  max_count?: number;
  min_count?: number;
  options?: string[];
  is_ranked?: boolean;
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
  created_at: string;
}

interface DbForm {
  id: number;
  title: string;
  slug: string;
  is_active: boolean;
  schema: FormSchema;
  event_id: number | null;
  created_at: string;
}

const mapDbFormToForm = (dbForm: DbForm): Form => ({
  id: dbForm.id,
  title: dbForm.title,
  slug: dbForm.slug,
  is_active: dbForm.is_active,
  schema: dbForm.schema,
  event_id: dbForm.event_id,
  created_at: dbForm.created_at,
});

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
  return mapDbFormToForm(data as DbForm);
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
  return mapDbFormToForm(data as DbForm);
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
