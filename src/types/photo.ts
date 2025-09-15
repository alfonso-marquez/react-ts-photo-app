export interface Photo {
  id?: number;
  title: string;
  description: string;
  camera_brand: string;
  photo_category: string;
  gear_used: string;
  location: string;
  photo_taken: string; // ISO date string
  photo_path: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}
