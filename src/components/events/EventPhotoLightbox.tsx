import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { EventPhotoAsset } from "@/services/eventService";

interface EventPhotoLightboxProps {
  open: boolean;
  photos: EventPhotoAsset[];
  currentIndex: number;
  isDownloading?: boolean;
  onOpenChange: (open: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
  onDownload: (photo: EventPhotoAsset) => void;
}

export const EventPhotoLightbox = ({
  open,
  photos,
  currentIndex,
  isDownloading = false,
  onOpenChange,
  onPrevious,
  onNext,
  onDownload,
}: EventPhotoLightboxProps) => {
  const activePhoto = photos[currentIndex];

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        onPrevious();
      }

      if (event.key === "ArrowRight") {
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrevious, open]);

  if (!activePhoto) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-1rem)] max-w-6xl border-[3px] border-foreground bg-background p-0 sm:max-h-[calc(100vh-2rem)]">
        <DialogHeader className="sr-only">
          <DialogTitle>{activePhoto.fileName}</DialogTitle>
          <DialogDescription>Event gallery photo preview.</DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[calc(100vh-2rem)] flex-col">
          <div className="relative flex min-h-[58vh] items-center justify-center overflow-hidden bg-foreground p-4 sm:p-6">
            <img
              src={activePhoto.publicUrl}
              alt={activePhoto.fileName}
              className="max-h-[calc(100vh-12rem)] w-auto max-w-full object-contain"
            />

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2"
              onClick={onPrevious}
              disabled={currentIndex <= 0}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onClick={onNext}
              disabled={currentIndex >= photos.length - 1}
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="border-t-[3px] border-foreground bg-card p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate font-display text-xl font-bold">{activePhoto.fileName}</p>
                <p className="font-body text-sm text-muted-foreground">
                  Photo {currentIndex + 1} of {photos.length}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="outline" onClick={onPrevious} disabled={currentIndex <= 0}>
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button type="button" variant="outline" onClick={onNext} disabled={currentIndex >= photos.length - 1}>
                  <ArrowRight className="h-4 w-4" />
                  Next
                </Button>
                <Button type="button" onClick={() => onDownload(activePhoto)} disabled={isDownloading}>
                  <Download className="h-4 w-4" />
                  {isDownloading ? "Downloading..." : "Download"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
