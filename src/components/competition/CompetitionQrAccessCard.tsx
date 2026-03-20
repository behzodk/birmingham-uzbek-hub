import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface CompetitionQrAccessCardProps {
  title: string;
  url: string;
}

export const CompetitionQrAccessCard = ({ title, url }: CompetitionQrAccessCardProps) => {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrError, setQrError] = useState("");

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
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <div className="mx-auto w-full max-w-[460px]">
        <div className="neo-card aspect-square w-full bg-card p-3 sm:p-4">
          <div className="flex h-full w-full items-center justify-center bg-background p-2">
            {qrError ? (
              <p className="text-center font-body text-sm text-destructive">{qrError}</p>
            ) : qrDataUrl ? (
              <img src={qrDataUrl} alt={`QR code for ${title}`} className="h-full w-full object-contain" />
            ) : (
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="neo-card bg-card p-4">
          <p className="mb-2 font-display text-sm uppercase tracking-wide text-muted-foreground">Public Rating URL</p>
          <div className="break-all border-[2px] border-foreground bg-background p-3 font-body text-sm text-foreground/85">
            {url}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          <Button onClick={handleCopyLink} type="button" className="w-full">
            <Copy className="h-4 w-4" />
            Copy Link
          </Button>
          <Button asChild variant="outline" className="w-full">
            <a href={url} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
              Open Link
            </a>
          </Button>
          <Button
            onClick={handleDownload}
            type="button"
            variant="accent"
            className="w-full sm:col-span-2 lg:col-span-1"
            disabled={!qrDataUrl}
          >
            <Download className="h-4 w-4" />
            Download QR
          </Button>
        </div>
      </div>
    </div>
  );
};
