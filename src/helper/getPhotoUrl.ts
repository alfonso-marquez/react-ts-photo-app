import { STORAGE_BASE } from "@/services/storage";

export function getPhotoUrl(photoPath: string): string {
  if (!photoPath) return ""; // fallback for empty paths

  // If photoPath is a full URL (seeded cat images)
  if (photoPath.startsWith("http")) {
    return photoPath;
  }

  // Otherwise, local storage file
  return `${STORAGE_BASE}/${photoPath}`;
}
