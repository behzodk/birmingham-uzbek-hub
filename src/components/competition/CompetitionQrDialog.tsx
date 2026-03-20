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
}

export const CompetitionQrDialog = ({ entry, itemLabel = "item" }: CompetitionQrDialogProps) => {
  const [open, setOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrError, setQrError] = useState("");

  const ratingUrl = buildCompetitionRatingUrl(entry.ratingPublicId);

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
      <DialogContent className="w-[calc(100vw-1rem)] max-w-3xl border-[3px] border-foreground bg-background p-0 sm:max-h-[calc(100vh-2rem)]">
        <DialogHeader className="border-b-[3px] border-foreground bg-secondary p-4 text-left sm:p-6">
          <DialogTitle className="break-words text-2xl sm:text-3xl">{getCompetitionEntryTitle(entry)}</DialogTitle>
          <DialogDescription className="text-foreground/80">
            Scan this QR code to open the public rating page for this {itemLabel.toLowerCase()}.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto p-4 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
            <div className="mx-auto w-full max-w-[420px]">
              <div className="neo-card aspect-square w-full bg-card p-3 sm:p-4">
                <div className="flex h-full w-full items-center justify-center bg-background p-2">
                  {qrError ? (
                    <p className="text-center font-body text-sm text-destructive">{qrError}</p>
                  ) : qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`QR code for ${getCompetitionEntryTitle(entry)}`}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">


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

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
