import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventPhotoBulkBarProps {
  selectedCount: number;
  isBusy: boolean;
  progressLabel?: string;
  onDownloadSelected: () => void;
  onClearSelection: () => void;
  onSelectAllLoaded: () => void;
}

export const EventPhotoBulkBar = ({
  selectedCount,
  isBusy,
  progressLabel,
  onDownloadSelected,
  onClearSelection,
  onSelectAllLoaded,
}: EventPhotoBulkBarProps) => {
  return (
    <div className="fixed inset-x-0 bottom-4 z-40 px-4">
      <div className="mx-auto max-w-4xl neo-card bg-card p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-lg font-bold">
              {selectedCount} photo{selectedCount === 1 ? "" : "s"} selected
            </p>
            <p className="font-body text-sm text-muted-foreground">
              {progressLabel ?? "Choose an action for the selected photos."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={onSelectAllLoaded} disabled={isBusy}>
              Select All Loaded
            </Button>
            <Button type="button" variant="outline" onClick={onClearSelection} disabled={isBusy}>
              <X className="h-4 w-4" />
              Clear Selection
            </Button>
            <Button type="button" onClick={onDownloadSelected} disabled={isBusy || selectedCount === 0}>
              <Download className="h-4 w-4" />
              {isBusy ? "Downloading..." : "Download Selected"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
