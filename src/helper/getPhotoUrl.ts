import { STORAGE_BASE } from "@/services/storage";

export function getPhotoUrl(photoPath: string): string {
  if (!photoPath) return ""; // fallback for empty paths

  // If photoPath is from update and create forms
  if (photoPath.startsWith("photos/")) {
    return `${STORAGE_BASE}/${photoPath}`;
  }

  // Otherwise, return original url (seeded cat images)
  return photoPath;
}
