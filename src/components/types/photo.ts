export interface Photo {
    camera_brand: string;
    photo_category: string;
    photo_path: string;
    id?: number;
    title: string;
    description: string;
    cameraBrand: string;
    gear_used: string;
    location: string;
    photo_taken: string; // ISO date string
    imageUrl?: string; // URL or path to the photo
    createdAt?: string; // ISO date string
    updatedAt?: string; // ISO date string
}