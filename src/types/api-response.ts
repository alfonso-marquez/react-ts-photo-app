import type { Photo } from "./photo";
import type { PaginationLinks } from "./pagination";

export interface PaginatedPhotosResponse {
  status: string; // "success"
  data: {
    current_page: number;
    data: Photo[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLinks[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}
