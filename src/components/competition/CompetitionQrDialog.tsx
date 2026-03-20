import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Download, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { buildCompetitionRatingUrl, getCompetitionEntryTitle } from "@/lib/competition";
import type { CompetitionEntry } from "@/types/competition";

interface CompetitionQrDialogProps {
  entry: CompetitionEntry;
  itemLabel?: string;
  note?: string | null;
  itemNumber?: string | null;
}

export const CompetitionQrDialog = ({
  entry,
  itemLabel = "item",
  note,
  itemNumber,
}: CompetitionQrDialogProps) => {
  const [open, setOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrError, setQrError] = useState("");

  const ratingUrl = buildCompetitionRatingUrl(entry.ratingPublicId);
  const entryTitle = getCompetitionEntryTitle(entry);

  useEffect(() => {
    if (!open) return;

    let isCancelled = false;

    QRCode.toDataURL(ratingUrl, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 320,
      color: {
        dark: "#111827",
        light: "#fffdf0",
      },
    })
      .then((url) => {
        if (!isCancelled) {
          setQrDataUrl(url);
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
  }, [open, ratingUrl]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(ratingUrl);
      toast.success("Rating link copied.");
    } catch {
      toast.error("We couldn't copy the rating link.");
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const anchor = document.createElement("a");
    anchor.href = qrDataUrl;
    anchor.download = `${entry.ratingPublicId}-rating-qr.png`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <QrCode className="h-4 w-4" />
          QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-1rem)] max-w-4xl border-[3px] border-foreground bg-background p-0 sm:max-h-[calc(100vh-2rem)]">
        <DialogHeader className="sr-only">
          <DialogTitle>{entryTitle}</DialogTitle>
          <DialogDescription>QR code access for this {itemLabel.toLowerCase()}.</DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-2rem)] overflow-y-auto">
          <div className="border-b-[3px] border-foreground bg-gradient-to-r from-secondary via-coral to-accent px-4 py-5 sm:px-6 sm:py-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="neo-badge bg-background text-foreground">{itemLabel}</span>
              {itemNumber ? <span className="neo-badge bg-card text-card-foreground">{itemNumber}</span> : null}
            </div>
            <h2 className="max-w-3xl break-words text-3xl font-black leading-none text-foreground sm:text-4xl">
              {entryTitle}
            </h2>
            <p className="mt-4 max-w-2xl font-body text-base font-medium text-foreground/85 sm:text-lg">
              Scan to rate this {itemLabel.toLowerCase()}.
            </p>
            {note ? <p className="mt-2 max-w-2xl font-body text-sm text-foreground/70 sm:text-base">{note}</p> : null}
          </div>

          <div className="grid gap-5 p-4 sm:gap-6 sm:p-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
            <div className="mx-auto w-full max-w-[420px]">
              <div className="mb-3 inline-flex items-center gap-2 rounded-none border-[3px] border-foreground bg-secondary px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.2em] text-secondary-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
                QR Scan Zone
              </div>
              <div className="border-[4px] border-foreground bg-white p-3 shadow-[10px_10px_0px_0px_hsl(var(--foreground))] sm:p-4">
                <div className="flex aspect-square w-full items-center justify-center bg-white p-3 sm:p-4">
                  {qrError ? (
                    <p className="text-center font-body text-sm text-destructive">{qrError}</p>
                  ) : qrDataUrl ? (
                    <img src={qrDataUrl} alt={`QR code for ${entryTitle}`} className="h-full w-full object-contain" />
                  ) : (
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
                  )}
                </div>
              </div>
              <p className="mt-4 font-body text-sm text-muted-foreground">
                Keep the code flat and well lit for the fastest scan.
              </p>
            </div>

            <div className="space-y-4">
              <div className="neo-card bg-muted p-4 sm:p-5">
                <p className="mb-2 font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Share This {itemLabel}
                </p>
                <p className="font-body text-sm text-foreground/80">
                  Use the QR code for table display, or copy the rating link for messages and group chats.
                </p>
              </div>

              <div className="space-y-3">
                <Button onClick={handleCopyLink} className="w-full" type="button">
                  <Copy className="h-4 w-4" />
                  Copy Link
                </Button>
                <Button onClick={handleDownload} variant="accent" className="w-full" type="button" disabled={!qrDataUrl}>
                  <Download className="h-4 w-4" />
                  Download QR
                </Button>
              </div>

              <div className="border-[3px] border-dashed border-foreground bg-card px-4 py-3">
                <p className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">Quick Tip</p>
                <p className="mt-2 font-body text-sm text-foreground/80">
                  The clean white scan area is intentional so phone cameras can lock onto the code easily.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
