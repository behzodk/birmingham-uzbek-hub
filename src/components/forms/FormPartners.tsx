import { ExternalLink, Globe } from "lucide-react";
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
    <div className={cn("w-full max-w-[26rem] space-y-3", className)}>
      {partners.map((partner) => (
        <a
          key={partner.id}
          href={partner.url}
          target="_blank"
          rel="noreferrer"
          aria-label={partner.name}
          className="neo-card group flex items-center gap-4 bg-[#e3ad37] p-4 transition-transform hover:-translate-y-[2px] sm:gap-5 sm:p-5"
        >
          <HoverCard openDelay={120} closeDelay={80}>
            <HoverCardTrigger asChild>
              <div
                title={partner.name}
                className="flex h-20 w-20 shrink-0 items-center justify-center border-[4px] border-foreground bg-background p-3 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] sm:h-24 sm:w-24"
              >
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <Globe className="h-9 w-9 text-foreground/60 transition-colors group-hover:text-foreground" />
                )}
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto max-w-[18rem] border-[3px] border-foreground bg-background px-4 py-3 shadow-[6px_6px_0px_0px_hsl(var(--foreground))]">
              <p className="font-display text-base font-bold leading-tight">{partner.name}</p>
            </HoverCardContent>
          </HoverCard>

          <div className="min-w-0 flex-1">
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.24em] text-foreground/70 sm:text-xs">
              In Partnership With
            </p>
            <p className="mt-1 font-display text-2xl font-black leading-[1.05] text-foreground sm:text-[2rem]">
              {partner.name}
            </p>
          </div>

          <ExternalLink className="h-5 w-5 shrink-0 text-foreground/55 transition-colors group-hover:text-foreground" />
        </a>
      ))}
    </div>
  );
};
