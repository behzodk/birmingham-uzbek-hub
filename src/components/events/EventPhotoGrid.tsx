import { memo, useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { EventPhotoAsset } from "@/services/eventService";

interface EventPhotoGridProps {
  photos: EventPhotoAsset[];
  hasMore: boolean;
  isLoadingMore: boolean;
  downloadingPhotoId: number | null;
  onOpenPhoto: (index: number) => void;
  onDownloadPhoto: (photo: EventPhotoAsset) => void;
  onLoadMore: () => void;
}

interface EventPhotoCardProps {
  photo: EventPhotoAsset;
  index: number;
  isDownloading: boolean;
  onOpenPhoto: (index: number) => void;
  onDownloadPhoto: (photo: EventPhotoAsset) => void;
}

const EventPhotoCard = memo(
  ({ photo, index, isDownloading, onOpenPhoto, onDownloadPhoto }: EventPhotoCardProps) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
      <div className="neo-card group overflow-hidden bg-card">
        <button
          type="button"
          onClick={() => onOpenPhoto(index)}
          className="block w-full text-left"
        >
          <AspectRatio ratio={4 / 3} className="relative overflow-hidden bg-muted">
            {!isLoaded ? <Skeleton className="absolute inset-0 h-full w-full rounded-none" /> : null}
            <img
              src={photo.publicUrl}
              alt={photo.fileName}
              loading="lazy"
              decoding="async"
              draggable={false}
              onLoad={() => setIsLoaded(true)}
              className={`h-full w-full object-cover transition duration-300 ${isLoaded ? "opacity-100" : "opacity-0"} group-hover:scale-[1.03]`}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-70" />
          </AspectRatio>
        </button>

        <div className="flex flex-col gap-2 border-t-[3px] border-foreground p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold">{photo.fileName}</p>
            <p className="font-body text-xs text-muted-foreground">Event photo</p>
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            className="hidden h-8 self-start px-2 text-[10px] tracking-[0.12em] sm:inline-flex sm:h-9 sm:self-auto sm:px-4 sm:text-xs"
            onClick={() => onDownloadPhoto(photo)}
            disabled={isDownloading}
          >
            <Download className="h-4 w-4" />
            {isDownloading ? "Downloading..." : "Download"}
          </Button>
        </div>
      </div>
    );
  }
);

EventPhotoCard.displayName = "EventPhotoCard";

export const EventPhotoGrid = ({
  photos,
  hasMore,
  isLoadingMore,
  downloadingPhotoId,
  onOpenPhoto,
  onDownloadPhoto,
  onLoadMore,
}: EventPhotoGridProps) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && !isLoadingMore) {
          onLoadMore();
        }
      },
      {
        rootMargin: "320px 0px",
        threshold: 0.1,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, onLoadMore]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {photos.map((photo, index) => (
          <EventPhotoCard
            key={photo.id}
            photo={photo}
            index={index}
            isDownloading={downloadingPhotoId === photo.id}
            onOpenPhoto={onOpenPhoto}
            onDownloadPhoto={onDownloadPhoto}
          />
        ))}
      </div>

      {hasMore ? (
        <div ref={loadMoreRef} className="flex justify-center">
          <div className="neo-card w-full max-w-xl bg-card px-4 py-4 sm:px-5">
            <div className="flex items-center justify-between gap-3">
              <p className="font-body text-sm font-semibold text-foreground/80">
                {isLoadingMore ? "Loading more photos..." : "Scroll to keep loading photos"}
              </p>
              <span className="font-body text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {photos.length} loaded
              </span>
            </div>
            <div className="mt-3 h-3 overflow-hidden border-[3px] border-foreground bg-background">
              <div
                className={`h-full bg-primary transition-all duration-300 ${
                  isLoadingMore ? "w-full animate-pulse" : "w-1/3"
                }`}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const EventPhotoGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="neo-card overflow-hidden bg-card">
        <AspectRatio ratio={4 / 3} className="bg-muted">
          <Skeleton className="h-full w-full rounded-none" />
        </AspectRatio>
        <div className="space-y-2 border-t-[3px] border-foreground p-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    ))}
  </div>
);
