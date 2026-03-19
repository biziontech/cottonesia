// components/data-table/DataTablePagination.jsx
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from "lucide-react";

export default function DataTablePagination({
    table,
    loading = false,
    serverSide = false,
    meta = null,
    onPageChange = null,
    onPageSizeChange = null
}) {
    // Untuk server-side, gunakan meta dari API
    const currentPage = serverSide ? meta?.current_page || 1 : table.getState().pagination.pageIndex + 1;
    const pageSize = serverSide ? meta?.per_page || 10 : table.getState().pagination.pageSize;
    const totalRows = serverSide ? meta?.total || 0 : table.getFilteredRowModel().rows.length;
    const totalDataRows = serverSide ? meta?.total || 0 : table.getRowModel().rows.length;
    const pageCount = serverSide ? meta?.last_page || 1 : table.getPageCount();

    // Calculate range
    const startRow = totalRows > 0 ? ((currentPage - 1) * pageSize) + 1 : 0;
    const endRow = Math.min(currentPage * pageSize, totalRows);

    // Check can navigate
    const canPreviousPage = currentPage > 1;
    const canNextPage = currentPage < pageCount;

    // Handle page change
    const handlePageChange = (newPage) => {
        if (serverSide && onPageChange) {
            onPageChange(newPage);
        } else {
            table.setPageIndex(newPage - 1);
        }
    };

    // Handle page size change
    const handlePageSizeChange = (newSize) => {
        if (serverSide && onPageSizeChange) {
            onPageSizeChange(Number(newSize));
        } else {
            table.setPageSize(Number(newSize));
        }
    };

    return (
        <div className="flex items-center justify-between px-4">
            <div className="hidden flex-1 text-sm lg:flex">
                {loading ? (<Skeleton className="h-5 w-40" />) : (<span>Showing {startRow} to {endRow} of {totalDataRows} entries</span>)}
            </div>
            <div className="flex flex-col-reverse gap-4 sm:gap-8 sm:flex-row w-full items-center lg:w-fit justify-center lg:justify-end">
                {/* Size Page */}
                <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-6 sm:space-y-0">
                    <div className="flex items-center gap-4">
                        {loading ? (<Skeleton className="h-5 w-24" />) : (<p className="text-sm font-medium">Rows per page</p>)}
                        {loading ? (<Skeleton className="h-9 w-[70px]" />) : (
                            <Select
                                value={`${pageSize}`}
                                onValueChange={handlePageSizeChange}
                            >
                                <SelectTrigger className="h-8 w-[70px]">
                                    <SelectValue placeholder={pageSize} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[6, 10, 15, 20, 30, 40, 50].map((size) => (
                                        <SelectItem key={size} value={`${size}`}>
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </div>
                {/* Page Index */}
                <div className="flex items-center justify-center text-sm font-medium">
                    {loading ? (<Skeleton className="h-5 w-[68px]" />) : (<span>Page {currentPage} of {pageCount}</span>)}
                </div>
                {/* Paginate Icon */}
                <div className="flex items-center space-x-2">
                    {loading ? (<Skeleton className="h-8 w-8" />) : (
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0 cursor-pointer"
                            onClick={() => handlePageChange(1)}
                            disabled={!canPreviousPage}
                        >
                            <span className="sr-only">Go to first page</span>
                            <ChevronsLeft className="h-5 w-5" />
                        </Button>
                    )}
                    {loading ? (<Skeleton className="h-8 w-8" />) : (
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0 cursor-pointer"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={!canPreviousPage}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    )}
                    {loading ? (<Skeleton className="h-8 w-8" />) : (
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0 cursor-pointer"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={!canNextPage}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    )}
                    {loading ? (<Skeleton className="h-8 w-8" />) : (
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0 cursor-pointer"
                            onClick={() => handlePageChange(pageCount)}
                            disabled={!canNextPage}
                        >
                            <span className="sr-only">Go to last page</span>
                            <ChevronsRight className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}