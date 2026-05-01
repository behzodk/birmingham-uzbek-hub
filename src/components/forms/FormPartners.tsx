import { Globe } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import type { FormPartner } from "@/services/formService";

export const FormPartners = ({
  partners,
  className,
}: {
  partners: FormPartner[];
  className?: string;
}) => {
  if (partners.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {partners.map((partner) => (
        <HoverCard key={partner.id} openDelay={120} closeDelay={80}>
          <HoverCardTrigger asChild>
            <a
              href={partner.url}
              target="_blank"
              rel="noreferrer"
              title={partner.name}
              aria-label={partner.name}
              className="group inline-flex h-[4.5rem] w-[4.5rem] items-center justify-center border-[3px] border-foreground bg-background p-3 shadow-[5px_5px_0px_0px_hsl(var(--foreground))] transition-transform hover:-translate-y-[2px] sm:h-20 sm:w-20"
            >
              {partner.logo_url ? (
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <Globe className="h-8 w-8 text-foreground/60 transition-colors group-hover:text-foreground" />
              )}
            </a>
          </HoverCardTrigger>
          <HoverCardContent className="w-auto max-w-[18rem] border-[3px] border-foreground bg-background px-4 py-3 shadow-[6px_6px_0px_0px_hsl(var(--foreground))]">
            <p className="font-display text-sm font-bold leading-tight">{partner.name}</p>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
};
