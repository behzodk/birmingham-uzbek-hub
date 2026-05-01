import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Camera, Clock, MapPin } from "lucide-react";
import { EventPhotoGrid, EventPhotoGridSkeleton } from "@/components/events/EventPhotoGrid";
import { EventPhotoLightbox } from "@/components/events/EventPhotoLightbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";
import { downloadEventPhotoAsset } from "@/lib/eventPhotoDownloads";
import {
  fetchEventById,
  fetchEventPhotoAssetsPage,
  type EventPhotoAsset,
} from "@/services/eventService";

const PREVIEW_PHOTO_LIMIT = 4;

const FormEventContextSkeleton = () => (
  <div className="space-y-6">
    <div className="neo-card overflow-hidden bg-card">
      <div className="grid lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)]">
        <div className="space-y-5 p-6 md:p-8">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-12 w-full max-w-2xl" />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-20 w-full" />
            ))}
          </div>
          <Skeleton className="h-5 w-full max-w-3xl" />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Skeleton className="h-11 w-40" />
            <Skeleton className="h-11 w-44" />
          </div>
        </div>
        <div className="hidden min-h-[260px] border-l-[3px] border-foreground bg-muted lg:block" />
      </div>
    </div>
    <EventPhotoGridSkeleton count={PREVIEW_PHOTO_LIMIT} />
  </div>
);

export const FormEventContext = ({ eventId }: { eventId: number | null }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [downloadingPhotoId, setDownloadingPhotoId] = useState<number | null>(null);

  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ["event-by-id", eventId],
    queryFn: () => fetchEventById(eventId!),
    enabled: Boolean(eventId),
  });

  const {
    data: photoPreview,
    isLoading: isLoadingPhotos,
    isError: isPhotoPreviewError,
  } = useQuery({
    queryKey: ["event-photo-preview", eventId],
    queryFn: () => fetchEventPhotoAssetsPage(eventId!, 0, PREVIEW_PHOTO_LIMIT),
    enabled: Boolean(eventId) && Boolean(event),
  });

  if (!eventId) {
    return null;
  }

  if (isLoadingEvent) {
    return <FormEventContextSkeleton />;
  }

  if (!event) {
    return null;
  }

  const photos = photoPreview?.items ?? [];
  const totalPhotos = photoPreview?.totalCount ?? 0;
  const eventImage = event.coverImage || event.featuredImage;

  const handleDownloadPhoto = async (photo: EventPhotoAsset) => {
    if (downloadingPhotoId !== null) {
      return;
    }

    setDownloadingPhotoId(photo.id);

    try {
      await downloadEventPhotoAsset(photo);
    } catch (error) {
      console.error("Error downloading event photo:", error);
      toast.error("We couldn't download this photo right now.");
    } finally {
      setDownloadingPhotoId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="neo-card overflow-hidden bg-card">
        <div className={eventImage ? "grid lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)]" : ""}>
          <div className="space-y-6 p-6 md:p-8">
            <div className="space-y-3">
              <span className="neo-badge inline-flex bg-secondary text-secondary-foreground">
                Linked Event
              </span>
              <div className="space-y-3">
                <h2 className="font-display text-3xl font-bold md:text-4xl">{event.title}</h2>
                <p className="max-w-3xl font-body text-sm text-muted-foreground md:text-base">
                  This registration form is attached to the event below, so visitors can see the event
                  details and the latest published gallery without leaving the page.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="neo-card bg-muted p-4">
                <div className="mb-2 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.12em] text-foreground/80">
                  <Calendar className="h-4 w-4" />
                  Date
                </div>
                <p className="font-body text-sm">{event.date}</p>
              </div>
              <div className="neo-card bg-muted p-4">
                <div className="mb-2 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.12em] text-foreground/80">
                  <Clock className="h-4 w-4" />
                  Time
                </div>
                <p className="font-body text-sm">{event.time}</p>
              </div>
              <div className="neo-card bg-muted p-4">
                <div className="mb-2 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.12em] text-foreground/80">
                  <MapPin className="h-4 w-4" />
                  Place
                </div>
                <p className="font-body text-sm break-words">{event.location}</p>
              </div>
              <div className="neo-card bg-muted p-4">
                <div className="mb-2 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.12em] text-foreground/80">
                  <Camera className="h-4 w-4" />
                  Photos
                </div>
                <p className="font-body text-sm">
                  {totalPhotos} public photo{totalPhotos === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            {event.description ? (
              <p className="max-w-3xl font-body text-sm leading-relaxed text-foreground/85 md:text-base">
                {event.description}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link to={`/events/${event.slug}`}>
                  View Event
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              {totalPhotos > 0 ? (
                <Button variant="outline" asChild>
                  <Link to={`/events/${event.slug}/photos`}>Open Full Gallery</Link>
                </Button>
              ) : null}
            </div>
          </div>

          {eventImage ? (
            <div
              className="min-h-[260px] border-t-[3px] border-foreground bg-cover bg-center lg:border-l-[3px] lg:border-t-0"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.22), rgba(0, 0, 0, 0.4)), url(${eventImage})`,
              }}
            />
          ) : null}
        </div>
      </div>

      {isLoadingPhotos ? <EventPhotoGridSkeleton count={PREVIEW_PHOTO_LIMIT} /> : null}

      {isPhotoPreviewError ? (
        <div className="neo-card bg-card p-6">
          <p className="font-body text-sm text-muted-foreground">
            Public photo preview is unavailable right now.
          </p>
        </div>
      ) : null}

      {!isLoadingPhotos && !isPhotoPreviewError && totalPhotos > 0 ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="font-display text-2xl font-bold">Latest Public Photos</h3>
              <p className="font-body text-sm text-muted-foreground">
                A quick preview of the latest gallery images connected to this event.
              </p>
            </div>

            <Button variant="outline" asChild>
              <Link to={`/events/${event.slug}/photos`}>View all {totalPhotos} photos</Link>
            </Button>
          </div>

          <EventPhotoGrid
            photos={photos}
            hasMore={false}
            isLoadingMore={false}
            downloadingPhotoId={downloadingPhotoId}
            onOpenPhoto={setLightboxIndex}
            onDownloadPhoto={(photo) => {
              void handleDownloadPhoto(photo);
            }}
            onLoadMore={() => undefined}
          />

          <EventPhotoLightbox
            open={lightboxIndex !== null}
            photos={photos}
            currentIndex={lightboxIndex ?? 0}
            isDownloading={downloadingPhotoId === photos[lightboxIndex ?? 0]?.id}
            onOpenChange={(open) => {
              if (!open) {
                setLightboxIndex(null);
              }
            }}
            onPrevious={() => {
              setLightboxIndex((current) => (current === null ? current : Math.max(current - 1, 0)));
            }}
            onNext={() => {
              setLightboxIndex((current) =>
                current === null ? current : Math.min(current + 1, photos.length - 1)
              );
            }}
            onDownload={(photo) => {
              void handleDownloadPhoto(photo);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
