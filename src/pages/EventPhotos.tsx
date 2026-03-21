import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, ImageIcon } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { EventPhotoGrid, EventPhotoGridSkeleton } from "@/components/events/EventPhotoGrid";
import { EventPhotoLightbox } from "@/components/events/EventPhotoLightbox";
import { downloadEventPhotoAsset } from "@/lib/eventPhotoDownloads";
import type { EventPhotoAsset } from "@/services/eventService";
import { fetchEventBySlug, fetchEventPhotoAssetsPage } from "@/services/eventService";
import { toast } from "@/components/ui/sonner";

const PAGE_SIZE = 24;

const EventPhotos = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [downloadingPhotoId, setDownloadingPhotoId] = useState<number | null>(null);

  const { data: event, isLoading: isLoadingEvent } = useQuery({
    queryKey: ["event", slug],
    queryFn: () => fetchEventBySlug(slug!),
    enabled: Boolean(slug),
  });

  const {
    data: photoPages,
    isPending: isLoadingPhotos,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isError: isPhotosError,
  } = useInfiniteQuery({
    queryKey: ["event-photo-gallery", event?.id],
    queryFn: ({ pageParam = 0 }) => fetchEventPhotoAssetsPage(event!.id, pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    enabled: Boolean(event?.id),
  });

  if (isLoadingEvent) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <SEO title="Gallery Not Found" />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-3 text-4xl font-bold">Gallery Not Found</h1>
          <p className="mb-8 font-body text-muted-foreground">
            This public event gallery is not available.
          </p>
          <Button onClick={() => navigate("/events")}>
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Button>
        </div>
      </Layout>
    );
  }

  const pages = photoPages?.pages ?? [];
  const photos = pages.flatMap((page) => page.items);
  const totalPhotos = pages[0]?.totalCount ?? 0;

  const handleDownloadPhoto = async (photo: EventPhotoAsset) => {
    if (downloadingPhotoId !== null) return;

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

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = (open: boolean) => {
    if (!open) {
      setLightboxIndex(null);
    }
  };

  return (
    <Layout>
      <SEO
        title={`${event.title} Photos`}
        description={`Public event photo gallery for ${event.title}.`}
        image={event.coverImage || event.featuredImage || "/og-image.jpg"}
        url={typeof window !== "undefined" ? window.location.href : undefined}
      />

      <section
        className={`relative ${event.color} ${event.color === "bg-primary" ? "text-white" : "text-foreground"} overflow-hidden py-12 md:py-20`}
        style={
          event.coverImage
            ? {
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${event.coverImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 right-[10%] h-8 w-8 border-[2px] border-foreground/20 animate-spin-slow md:h-12 md:w-12" style={{ animationDuration: "15s" }} />
          <div className="absolute bottom-12 left-[8%] h-6 w-6 rotate-45 border-[2px] border-foreground/20 animate-spin-slow md:h-10 md:w-10" style={{ animationDuration: "20s" }} />
        </div>

        <div className="container relative z-10 mx-auto px-4">
          <Button variant="ghost" className="mb-6 hover:bg-background/20" onClick={() => navigate(`/events/${event.slug}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Event
          </Button>

          <div className="max-w-4xl">
            <span className="neo-badge mb-4 inline-flex items-center gap-2 bg-foreground text-background">
              <ImageIcon className="h-4 w-4" />
              Event Gallery
            </span>
            <h1 className="mb-6 font-display text-3xl font-bold sm:text-4xl md:text-5xl">{event.title}</h1>

            <div className="grid gap-4 font-body text-sm md:grid-cols-2 xl:grid-cols-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                <span>{totalPhotos} photo{totalPhotos === 1 ? "" : "s"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{event.date}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto space-y-8 px-4">
          <div className="neo-card bg-card p-4 md:p-6">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold">Photo Gallery</h2>
                <p className="font-body text-sm text-muted-foreground">
                  Browse the latest event photos, open any image for a closer look, and download photos one at a time.
                </p>
                <p className="mt-2 font-body text-sm text-muted-foreground">
                  Bulk download and selection are disabled for now. Use the download button on each photo card or inside the preview.
                </p>
              </div>
            </div>
          </div>

          {isLoadingPhotos ? (
            <EventPhotoGridSkeleton count={8} />
          ) : isPhotosError ? (
            <div className="neo-card bg-card p-8 text-center">
              <h3 className="mb-2 text-2xl font-bold">We couldn&apos;t load the gallery</h3>
              <p className="mb-6 font-body text-muted-foreground">
                Please try again. The event is public, but the photo list could not be loaded right now.
              </p>
              <Button type="button" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : photos.length === 0 ? (
            <div className="neo-card bg-card p-8 text-center">
              <h3 className="mb-2 text-2xl font-bold">No photos yet</h3>
              <p className="mb-6 font-body text-muted-foreground">
                Event photos will appear here once they have been published.
              </p>
              <Button asChild variant="outline">
                <Link to={`/events/${event.slug}`}>Back to Event</Link>
              </Button>
            </div>
          ) : (
            <EventPhotoGrid
              photos={photos}
              hasMore={Boolean(hasNextPage)}
              isLoadingMore={isFetchingNextPage}
              downloadingPhotoId={downloadingPhotoId}
              onOpenPhoto={openLightbox}
              onDownloadPhoto={(photo) => {
                void handleDownloadPhoto(photo);
              }}
              onLoadMore={() => fetchNextPage()}
            />
          )}
        </div>
      </section>

      <EventPhotoLightbox
        open={lightboxIndex !== null}
        photos={photos}
        currentIndex={lightboxIndex ?? 0}
        onOpenChange={closeLightbox}
        onPrevious={() => setLightboxIndex((current) => (current === null ? current : Math.max(current - 1, 0)))}
        onNext={() => setLightboxIndex((current) => (current === null ? current : Math.min(current + 1, photos.length - 1)))}
        isDownloading={downloadingPhotoId === photos[lightboxIndex ?? 0]?.id}
        onDownload={(photo) => {
          void handleDownloadPhoto(photo);
        }}
      />
    </Layout>
  );
};

export default EventPhotos;
