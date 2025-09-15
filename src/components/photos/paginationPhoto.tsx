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

    const maxVisible = 5; // how many numbers to show in the middle
    const pages: (number | string)[] = [];

    if (last_page <= maxVisible) {
        // show all pages if small
        for (let i = 1; i <= last_page; i++) pages.push(i);
    } else {
        // always show first page
        pages.push(1);

        let start = Math.max(2, current_page - 1);
        let end = Math.min(last_page - 1, current_page + 1);

        if (start > 2) pages.push("...");
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < last_page - 1) pages.push("...");

        // always show last page
        pages.push(last_page);
    }

    return (
        <Pagination style={{ justifyContent: "end" }} aria-label="Pagination">
            <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (current_page > 1) onPageChange(current_page - 1);
                        }}
                        className={current_page === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>

                {/* Pages with ellipsis */}
                {pages.map((p, idx) =>
                    p === "..." ? (
                        <PaginationItem key={`ellipsis-${idx}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={p}>
                            <PaginationLink
                                href="#"
                                isActive={p === current_page}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(p as number);
                                }}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}

                {/* Next */}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (current_page < last_page) onPageChange(current_page + 1);
                        }}
                        className={current_page === last_page ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
                {/* Last */}
                <PaginationItem>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (current_page !== last_page) onPageChange(last_page);
                        }}
                        className={current_page === last_page ? "pointer-events-none opacity-50" : ""}
                    >
                        Last
                    </PaginationLink>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}