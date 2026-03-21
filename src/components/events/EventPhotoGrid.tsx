import { memo, useState } from "react";
import { Check, ImageIcon } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { EventPhotoAsset } from "@/services/eventService";

interface EventPhotoGridProps {
  photos: EventPhotoAsset[];
  selectionMode: boolean;
  selectedIds: Set<number>;
  hasMore: boolean;
  isLoadingMore: boolean;
  onOpenPhoto: (index: number) => void;
  onToggleSelect: (photoId: number) => void;
  onLoadMore: () => void;
}

interface EventPhotoCardProps {
  photo: EventPhotoAsset;
  index: number;
  selectionMode: boolean;
  isSelected: boolean;
  onOpenPhoto: (index: number) => void;
  onToggleSelect: (photoId: number) => void;
}

const EventPhotoCard = memo(
  ({ photo, index, selectionMode, isSelected, onOpenPhoto, onToggleSelect }: EventPhotoCardProps) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
      <div className="neo-card group overflow-hidden bg-card">
        <button
          type="button"
          onClick={() => {
            if (selectionMode) {
              onToggleSelect(photo.id);
              return;
            }

            onOpenPhoto(index);
          }}
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
            {selectionMode ? (
              <div className="absolute left-3 top-3">
                <span
                  className={`neo-badge ${isSelected ? "bg-secondary text-secondary-foreground" : "bg-background text-foreground"}`}
                >
                  {isSelected ? "Selected" : "Select"}
                </span>
              </div>
            ) : null}
          </AspectRatio>
        </button>

        <div className="flex items-center justify-between gap-3 border-t-[3px] border-foreground p-3">
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-bold">{photo.fileName}</p>
            <p className="font-body text-xs text-muted-foreground">Event photo</p>
          </div>


            <Button
              type="button"
              size="sm"
              variant={isSelected ? "secondary" : "outline"}
              onClick={() => onToggleSelect(photo.id)}
            >
              <Check className="h-4 w-4" />
              {isSelected ? "Selected" : "Select"}
            </Button>
        </div>
      </div>
    );
  }
);

EventPhotoCard.displayName = "EventPhotoCard";

export const EventPhotoGrid = ({
  photos,
  selectionMode,
  selectedIds,
  hasMore,
  isLoadingMore,
  onOpenPhoto,
  onToggleSelect,
  onLoadMore,
}: EventPhotoGridProps) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {photos.map((photo, index) => (
          <EventPhotoCard
            key={photo.id}
            photo={photo}
            index={index}
            selectionMode={selectionMode}
            isSelected={selectedIds.has(photo.id)}
            onOpenPhoto={onOpenPhoto}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </div>

      {hasMore ? (
        <div className="flex justify-center">
          <Button type="button" variant="outline" size="lg" onClick={onLoadMore} disabled={isLoadingMore}>
            {isLoadingMore ? "Loading More..." : "Load More Photos"}
          </Button>
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
