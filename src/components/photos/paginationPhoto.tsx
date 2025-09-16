import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import type { PaginationPhotoProps } from "../../types/pagination-photo";

export default function PaginationPhoto({ pagination, onPageChange }: PaginationPhotoProps) {
    const { current_page, last_page } = pagination;

    const maxVisible = 5; // Max number of visible page numbers in the middle

    // Helper function to calculate the pagination items
    const getPages = () => {
        const pages: (number | string)[] = [];

        if (last_page <= maxVisible) {
            // Show all pages if the number of pages is smaller than the visible limit
            for (let i = 1; i <= last_page; i++) pages.push(i);
        } else {
            // Always show the first page
            pages.push(1);

            const start = Math.max(2, current_page - 1); // Prevent going below page 2
            const end = Math.min(last_page - 1, current_page + 1); // Prevent going above the last page

            if (start > 2) pages.push("..."); // Add ellipsis if there's a gap
            for (let i = start; i <= end; i++) pages.push(i);
            if (end < last_page - 1) pages.push("..."); // Add ellipsis if there's a gap

            // Always show the last page
            pages.push(last_page);
        }

        return pages;
    };

    const pages = getPages();

    return (
        <Pagination style={{ justifyContent: "end" }} aria-label="Pagination">
            <PaginationContent>
                {/* Previous Button */}
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (current_page > 1) onPageChange(current_page - 1);
                        }}
                        className={current_page === 1 ? "pointer-events-none opacity-50" : ""}
                        aria-label="Previous page"
                    />
                </PaginationItem>

                {/* Page Numbers & Ellipses */}
                {pages.map((p) => (
                    <PaginationItem key={p}>
                        {p === "..." ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                href="#"
                                isActive={p === current_page}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (p !== current_page) onPageChange(p as number);
                                }}
                                aria-current={p === current_page ? "page" : undefined}
                            >
                                {p}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                )
                )}

                {/* Next Button */}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (current_page < last_page) onPageChange(current_page + 1);
                        }}
                        className={current_page === last_page ? "pointer-events-none opacity-50" : ""}
                        aria-label="Next page"
                    />
                </PaginationItem>
                {/* Last Page Button */}
                <PaginationItem>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (current_page !== last_page) onPageChange(last_page);
                        }}
                        className={current_page === last_page ? "pointer-events-none opacity-50" : ""}
                        aria-label="Last page"
                    >
                        Last
                    </PaginationLink>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}