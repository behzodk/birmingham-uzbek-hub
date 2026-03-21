import JSZip from "jszip";
import type { EventPhotoAsset } from "@/services/eventService";

export class EventPhotoDownloadError extends Error {
  code: "PHOTO_FETCH_FAILED" | "PHOTO_CORS_BLOCKED";

  constructor(code: "PHOTO_FETCH_FAILED" | "PHOTO_CORS_BLOCKED") {
    super(code);
    this.code = code;
  }
}

const sanitizeFileName = (value: string) =>
  value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .replace(/^-+|-+$/g, "");

export const getEventPhotoDownloadName = (asset: EventPhotoAsset, index?: number) => {
  const fileName = sanitizeFileName(asset.fileName);
  if (fileName) return fileName;

  const extension =
    asset.mimeType?.startsWith("image/")
      ? asset.mimeType.split("/")[1]?.replace("jpeg", "jpg")
      : "jpg";

  return `event-photo-${typeof index === "number" ? index + 1 : asset.id}.${extension || "jpg"}`;
};

const saveBlobAsFile = (blob: Blob, fileName: string) => {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};

const openDirectDownload = (asset: EventPhotoAsset, index?: number) => {
  const anchor = document.createElement("a");
  anchor.href = asset.publicUrl;
  anchor.download = getEventPhotoDownloadName(asset, index);
  anchor.target = "_blank";
  anchor.rel = "noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};

export const downloadEventPhotoAsset = async (asset: EventPhotoAsset, index?: number) => {
  try {
    const response = await fetch(asset.publicUrl);
    if (!response.ok) {
      throw new EventPhotoDownloadError("PHOTO_FETCH_FAILED");
    }

    const blob = await response.blob();
    saveBlobAsFile(blob, getEventPhotoDownloadName(asset, index));
  } catch {
    openDirectDownload(asset, index);
  }
};

const fetchPhotoBlob = async (asset: EventPhotoAsset) => {
  let response: Response;

  try {
    response = await fetch(asset.publicUrl);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new EventPhotoDownloadError("PHOTO_CORS_BLOCKED");
    }

    throw error;
  }

  if (!response.ok) {
    throw new EventPhotoDownloadError("PHOTO_FETCH_FAILED");
  }

  return response.blob();
};

const sanitizeArchiveName = (value: string) =>
  sanitizeFileName(value).toLowerCase().replace(/\s+/g, "-") || "event-photos";

export const downloadEventPhotoArchive = async ({
  assets,
  archiveName,
  onFetchProgress,
  onZipProgress,
}: {
  assets: EventPhotoAsset[];
  archiveName: string;
  onFetchProgress?: (completed: number, total: number) => void;
  onZipProgress?: (percent: number) => void;
}) => {
  if (assets.length === 0) {
    throw new EventPhotoDownloadError("PHOTO_FETCH_FAILED");
  }

  const total = assets.length;
  const zip = new JSZip();
  const maxConcurrency = 4;
  let completed = 1;
  let cursor = 1;

  // Probe the first asset before launching concurrent work so a CORS misconfiguration
  // fails fast with one clear error instead of several simultaneous browser fetch errors.
  const firstBlob = await fetchPhotoBlob(assets[0]);
  zip.file(getEventPhotoDownloadName(assets[0], 0), firstBlob);
  onFetchProgress?.(completed, total);

  const worker = async () => {
    while (cursor < assets.length) {
      const currentIndex = cursor;
      cursor += 1;

      const asset = assets[currentIndex];
      const blob = await fetchPhotoBlob(asset);
      zip.file(getEventPhotoDownloadName(asset, currentIndex), blob);
      completed += 1;
      onFetchProgress?.(completed, total);
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(maxConcurrency, assets.length) }, () => worker())
  );

  const archiveBlob = await zip.generateAsync(
    {
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      onZipProgress?.(metadata.percent);
    }
  );

  saveBlobAsFile(archiveBlob, `${sanitizeArchiveName(archiveName)}.zip`);
};
