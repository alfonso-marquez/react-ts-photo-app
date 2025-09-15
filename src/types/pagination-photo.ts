import type { PaginationMeta, PaginationLinks as LinkType } from "./pagination";

export interface PaginationPhotoProps {
  pagination: PaginationMeta;
  // links: LinkType[];
  onPageChange: (page: number) => void;
}
