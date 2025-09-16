import type { PaginationMeta } from "./pagination";

export interface PaginationPhotoProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}
