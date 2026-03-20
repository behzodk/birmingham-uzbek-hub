import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface CompetitionQrAccessCardProps {
  title: string;
  url: string;
  categoryLabel?: string;
  instructionText?: string;
  note?: string | null;
  itemNumber?: string | null;
}

export const CompetitionQrAccessCard = ({
  title,
  url,
  categoryLabel,
  instructionText,
  note,
  itemNumber,
}: CompetitionQrAccessCardProps) => {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrError, setQrError] = useState("");
  const badgeLabel = categoryLabel?.trim() || "Rating Access";
  const instructionLabel = instructionText?.trim() || "Scan to rate this dish";

  useEffect(() => {
    let isCancelled = false;

    QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 420,
      color: {
        dark: "#111827",
        light: "#fffdf0",
      },
    })
      .then((nextUrl) => {
        if (!isCancelled) {
          setQrDataUrl(nextUrl);
          setQrError("");
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setQrError("We couldn't generate the QR code image.");
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [url]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Rating link copied.");
    } catch {
      toast.error("We couldn't copy the rating link.");
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const anchor = document.createElement("a");
    anchor.href = qrDataUrl;
    anchor.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-rating-qr.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <div className="neo-card overflow-hidden bg-card">
      <div className="border-b-[3px] border-foreground bg-gradient-to-r from-secondary via-coral to-accent px-4 py-5 sm:px-6 sm:py-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="neo-badge bg-background text-foreground">{badgeLabel}</span>
          {itemNumber ? <span className="neo-badge bg-card text-card-foreground">{itemNumber}</span> : null}
        </div>
        <h3 className="max-w-3xl text-3xl font-black leading-none text-foreground sm:text-4xl">{title}</h3>
        <p className="mt-4 max-w-2xl font-body text-base font-medium text-foreground/85 sm:text-lg">
          {instructionLabel}
        </p>
        {note ? <p className="mt-2 max-w-2xl font-body text-sm text-foreground/70 sm:text-base">{note}</p> : null}
      </div>

      <div className="grid gap-5 p-4 sm:gap-6 sm:p-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="mx-auto w-full max-w-[460px]">
          <div className="mb-3 inline-flex items-center gap-2 rounded-none border-[3px] border-foreground bg-secondary px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-secondary-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
            QR Scan Zone
          </div>
          <div className="border-[4px] border-foreground bg-white p-3 shadow-[10px_10px_0px_0px_hsl(var(--foreground))] sm:p-4">
            <div className="flex aspect-square w-full items-center justify-center bg-white p-3 sm:p-4">
              {qrError ? (
                <p className="text-center font-body text-sm text-destructive">{qrError}</p>
              ) : qrDataUrl ? (
                <img src={qrDataUrl} alt={`QR code for ${title}`} className="h-full w-full object-contain" />
              ) : (
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
              )}
            </div>
          </div>
          <p className="mt-4 font-body text-sm text-muted-foreground">
            Use your phone camera to open the public rating page instantly.
          </p>
        </div>

        <div className="space-y-4">
          <div className="neo-card bg-muted p-4 sm:p-5">
            <p className="mb-2 font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">Rating Link</p>
            <div className="break-all border-[3px] border-foreground bg-background p-3 font-body text-sm font-medium text-foreground/85">
              {url}
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={handleCopyLink} type="button" className="w-full justify-center">
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
            <Button asChild variant="outline" className="w-full justify-center">
              <a href={url} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                Open Link
              </a>
            </Button>
            <Button
              onClick={handleDownload}
              type="button"
              variant="accent"
              className="w-full justify-center"
              disabled={!qrDataUrl}
            >
              <Download className="h-4 w-4" />
              Download QR
            </Button>
          </div>

          <div className="border-[3px] border-dashed border-foreground bg-card px-4 py-3">
            <p className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">Festival Tip</p>
            <p className="mt-2 font-body text-sm text-foreground/80">
              Keep this card nearby so guests can scan, score, and move on quickly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
