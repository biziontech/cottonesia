import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from "@/components/ui/pagination";

export default function BasePagination({ data, onPageChange }) {
    // check data
    if (!data || !data.links || data.links.length <= 3) return null;
    // return page
    return (
        <Pagination className="w-fit">
            <PaginationContent>
                {data.links.map((link, index) => {
                    // Previous button - selalu tampil, disabled jika url null
                    if (link.label === "&laquo; Previous") {
                        return (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    onClick={() => link.url && onPageChange(link.page)}
                                    className={!link.url ? 'pointer-events-none opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                    aria-label="Go to previous page"
                                    aria-disabled={!link.url}
                                    size="icon"
                                >
                                    <ChevronsLeft className="h-4 w-4" />
                                </PaginationLink>
                            </PaginationItem>
                        );
                    }

                    // Next button - selalu tampil, disabled jika url null
                    if (link.label === "Next &raquo;") {
                        return (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    onClick={() => link.url && onPageChange(link.page)}
                                    className={!link.url ? 'pointer-events-none opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                    aria-label="Go to next page"
                                    aria-disabled={!link.url}
                                    size="icon"
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </PaginationLink>
                            </PaginationItem>
                        );
                    }

                    // Elipisis
                    if (link.label === "...") {
                        return (
                            <PaginationItem key={index}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    // Page numbers
                    return (
                        <PaginationItem key={index}>
                            <PaginationLink
                                onClick={() => link.url && onPageChange(link.page)}
                                isActive={link.active}
                                className="cursor-pointer"
                            >
                                {link.label}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
            </PaginationContent>
        </Pagination>
    );
}
