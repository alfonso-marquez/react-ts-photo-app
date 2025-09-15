export interface PaginationLinks {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  // links: PaginationLinks[];
}