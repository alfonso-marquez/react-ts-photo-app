import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import type { PaginationPhotoProps } from "../types/pagination-photo";
export default function PaginationPhoto({ pagination, links, onPageChange }: PaginationPhotoProps) {

    const { current_page, last_page } = pagination;
    console.log("Photo list in pagination:", pagination);

    return (
        <Pagination style={{ justifyContent: "end" }} aria-label="Pagination">
            <PaginationContent>
                {links.map((link, i) => (
                    <PaginationItem key={i}>
                        {link.label.includes("Previous") ? (
                            <PaginationPrevious
                                href={link.url ?? "#"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (link.page && onPageChange) onPageChange(link.page);
                                }}
                                className={current_page === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        ) : link.label.includes("Next") ? (
                            <PaginationNext
                                href={link.url ?? "#"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (link.page && onPageChange) onPageChange(link.page);
                                }}
                                className={current_page === last_page ? "pointer-events-none opacity-50" : ""}
                            />
                        ) : link.label.includes("...") ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                href={link.url ?? "#"}
                                isActive={link.active}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (link.page && onPageChange) onPageChange(link.page);
                                }}
                            >
                                {link.label}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}
            </PaginationContent>
        </Pagination>
    );
}