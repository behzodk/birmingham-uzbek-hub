import type { FormSchemaField } from "@/services/formService";

const ALLOWED_TAGS = new Set([
  "a",
  "blockquote",
  "br",
  "div",
  "em",
  "figcaption",
  "figure",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "img",
  "li",
  "ol",
  "p",
  "span",
  "strong",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
]);

const isSafeUrl = (value: string, { allowImageData = false }: { allowImageData?: boolean } = {}) => {
  const trimmed = value.trim();
  if (!trimmed) return false;

  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("./") ||
    trimmed.startsWith("../") ||
    trimmed.startsWith("#")
  ) {
    return true;
  }

  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) {
    return true;
  }

  if (allowImageData && /^data:image\//i.test(trimmed)) {
    return true;
  }

  return false;
};

const unwrapElement = (element: Element) => {
  const parent = element.parentNode;
  if (!parent) return;

  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }

  parent.removeChild(element);
};

const sanitizeRichHtml = (html: string) => {
  if (!html.trim() || typeof window === "undefined" || typeof DOMParser === "undefined") {
    return html;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.querySelectorAll("script, style, iframe, object, embed, form, input, button, textarea, select, option").forEach((node) => {
    node.remove();
  });

  const elements = Array.from(doc.body.querySelectorAll("*"));

  elements.forEach((element) => {
    const tagName = element.tagName.toLowerCase();

    if (!ALLOWED_TAGS.has(tagName)) {
      unwrapElement(element);
      return;
    }

    Array.from(element.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value;

      if (name.startsWith("on") || name === "style" || name === "srcdoc") {
        element.removeAttribute(attribute.name);
        return;
      }

      if (tagName === "a" && name === "href") {
        if (!isSafeUrl(value)) {
          element.removeAttribute(attribute.name);
          return;
        }

        if (/^https?:\/\//i.test(value.trim())) {
          element.setAttribute("target", "_blank");
          element.setAttribute("rel", "noreferrer");
        }

        return;
      }

      if (tagName === "img" && name === "src") {
        if (!isSafeUrl(value, { allowImageData: true })) {
          element.remove();
        }
        return;
      }

      const allowedAttribute =
        (tagName === "a" && ["href", "target", "rel", "title"].includes(name)) ||
        (tagName === "img" && ["src", "alt", "title", "width", "height"].includes(name)) ||
        ((tagName === "td" || tagName === "th") && ["colspan", "rowspan"].includes(name));

      if (!allowedAttribute) {
        element.removeAttribute(attribute.name);
      }
    });
  });

  return doc.body.innerHTML;
};

interface FormContentBlockProps {
  field: FormSchemaField;
}

export const FormContentBlock = ({ field }: FormContentBlockProps) => {
  const contentHtml = sanitizeRichHtml(field.content_html ?? "");
  const label = field.label?.trim();

  if (!label && !contentHtml.trim()) {
    return null;
  }

  return (
    <div className="neo-card bg-muted p-4 md:p-6">
      {label ? <h2 className="mb-4 text-2xl font-bold">{label}</h2> : null}
      {contentHtml.trim() ? (
        <div
          className="form-rich-content"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      ) : null}
    </div>
  );
};
