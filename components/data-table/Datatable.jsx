// components/data-table/Datatable.jsx
import { cn } from "@/lib/utils";
import { Loader2, TriangleAlert } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DataTablePagination from "@/components/data-table/DataTablePagination";

const calculateRowSpansAdvanced = (rows, columnId, compareFunction) => {
    const spans = [];
    let currentSpan = 1;
    let currentValue = null;

    for (let i = 0; i < rows.length; i++) {
        const cellValue = rows[i].getValue(columnId);
        const rowData = rows[i].original;

        if (i === 0) {
            currentValue = cellValue;
            spans.push({ rowspan: 1, show: true });
        } else {
            const shouldMerge = compareFunction
                ? compareFunction(cellValue, currentValue, rowData, rows[i - 1].original)
                : cellValue === currentValue;

            if (shouldMerge) {
                currentSpan++;
                spans.push({ rowspan: 0, show: false });
                spans[i - currentSpan + 1].rowspan = currentSpan;
            } else {
                currentSpan = 1;
                currentValue = cellValue;
                spans.push({ rowspan: 1, show: true });
            }
        }
    }

    return spans;
};

function DataTable({
    columns,
    rowHeight = null,
    error = null,
    data,
    meta = null,
    toolbar: ToolbarComponent,
    react_table,
    no_header = false,
    mergeConfig = [],
    serverSide = false,
    onPageChange = null,
    onPageSizeChange = null,
    onRefresh = null, 
    variant = "default", // "default" | "outline"
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [showData, setShowData] = useState(false);
    const [previousHeight, setPreviousHeight] = useState(96);

    useEffect(() => {
        let minLoadingTimer, transitionTimer;
        if (data === null) {
            setIsLoading(true);
            setShowData(false);
        } else {
            minLoadingTimer = setTimeout(() => {
                setIsLoading(false);
                transitionTimer = setTimeout(() => setShowData(true), 500);
            }, 1000);
        }
        return () => {
            clearTimeout(minLoadingTimer);
            clearTimeout(transitionTimer);
        };
    }, [data]);

    useEffect(() => {
        if (error) {
            setIsLoading(false);
            setShowData(true);
        }
    }, [error]);

    const tableOptions = useMemo(() => {
        const options = {
            data: data || [],
            columns,
            getCoreRowModel: getCoreRowModel(),
            ...react_table,
            meta: {
                serverSide: serverSide,
                onSort: react_table?.onSort || null,
                reload: onRefresh,
            },
        };

        if (serverSide && meta) {
            options.manualPagination = true;
            options.pageCount = meta.last_page;
            options.state = {
                ...options.state,
                pagination: {
                    pageIndex: meta.current_page - 1,
                    pageSize: meta.per_page,
                }
            };
        }

        return options;
    }, [data, columns, react_table, serverSide, meta, onRefresh]);

    const table = useReactTable(tableOptions);

    const rows = table.getRowModel().rows;
    const rowSpanData = {};

    if (data !== null) {
        mergeConfig.forEach(config => {
            const { columnId, compareFunction } = typeof config === 'string'
                ? { columnId: config, compareFunction: null }
                : config;

            rowSpanData[columnId] = calculateRowSpansAdvanced(rows, columnId, compareFunction);
        });
    }

    const mergeColumns = mergeConfig.map(config =>
        typeof config === 'string' ? config : config.columnId
    );

    const loadingHeight = 96;
    const rowHeightData = rowHeight ?? 56;
    const rowCount = table.getRowModel().rows?.length || 0;
    const targetHeight = rowCount > 0 ? rowCount * rowHeightData : loadingHeight;

    useEffect(() => {
        if (showData && !isLoading && targetHeight > 0) {
            setPreviousHeight(targetHeight);
        }
    }, [showData, isLoading, targetHeight]);

    // Variant styles
    const isOutline = variant === "outline";

    const containerStyles = isOutline
        ? "border-border dark:border-border bg-background dark:bg-background"
        : "border-[var(--color-datatable-border)] dark:border-[var(--color-datatable-border-dark)] bg-[var(--color-datatable-bg)] dark:bg-[var(--color-datatable-bg-dark)]";

    const headerStyles = isOutline
        ? "bg-gray-50 dark:bg-background border-b border-border dark:border-border"
        : "bg-[var(--color-datatable-header-bg)] dark:bg-[var(--color-datatable-header-bg-dark)]";

    const headerTextStyles = isOutline
        ? "text-foreground dark:text-foreground"
        : "text-[var(--color-datatable-header-text)] dark:text-[var(--color-datatable-header-text-dark)]";

    const bodyBgStyles = isOutline
        ? "bg-background dark:bg-background"
        : "bg-[var(--color-datatable-bg)] dark:bg-[var(--color-datatable-bg-dark)]";

    const rowHoverStyles = isOutline
        ? "hover:bg-accent/50 dark:hover:bg-accent/50"
        : "hover:bg-[var(--color-datatable-row-hover)] dark:hover:bg-[var(--color-datatable-row-hover-dark)]";

    const textStyles = isOutline
        ? "text-foreground dark:text-foreground"
        : "text-[var(--color-datatable-text)] dark:text-[var(--color-datatable-text-dark)]";

    const mutedTextStyles = isOutline
        ? "text-muted-foreground dark:text-muted-foreground"
        : "text-[var(--color-datatable-muted-text)] dark:text-[var(--color-datatable-muted-text-dark)]";

    const borderStyles = isOutline
        ? "border-border dark:border-border"
        : "border-[var(--color-datatable-border)] dark:border-[var(--color-datatable-border-dark)]";

    const pinnedBgStyles = isOutline
        ? "bg-background dark:bg-background"
        : "bg-[var(--color-datatable-pinned-bg)] dark:bg-[var(--color-datatable-pinned-bg-dark)]";

    const pinnedHoverStyles = isOutline
        ? "group-hover:bg-accent/50 group-hover:dark:bg-accent/50"
        : "group-hover:bg-[var(--color-datatable-pinned-hover)] group-hover:dark:bg-[var(--color-datatable-pinned-hover-dark)]";

    return (
        <div className="flex flex-col gap-4">
            {ToolbarComponent && (
                <ToolbarComponent
                    table={table}
                    error={error}
                />
            )}

            <div className={cn(
                "overflow-x-auto rounded-xl border",
                containerStyles
            )}>
                <Table>
                    <TableHeader className={cn(
                        "sticky top-0 z-10",
                        headerStyles
                    )}>
                        {!no_header && (
                            table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="transition-colors">
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className={cn(
                                                header?.column?.columnDef?.headClassName,
                                                headerTextStyles,
                                                headerStyles
                                            )}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableHeader>
                    <TableBody className="relative">
                        {!showData && (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className={cn(
                                        "p-4 align-middle text-center transition-all duration-500 ease-in-out overflow-hidden",
                                        bodyBgStyles
                                    )}
                                    style={{
                                        border: "none",
                                        height: isLoading ? loadingHeight : targetHeight
                                    }}
                                >
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className={cn(
                                            "h-6 w-6 animate-spin",
                                            mutedTextStyles
                                        )} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}

                        {showData && (
                            error ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className={cn(
                                            "h-24 text-center",
                                            bodyBgStyles
                                        )}
                                    >
                                        <div className="flex items-center justify-center">
                                            <TriangleAlert className={cn(
                                                "h-6 w-6",
                                                mutedTextStyles
                                            )} />
                                            <span className={cn(
                                                "ml-2",
                                                mutedTextStyles
                                            )}>Gagal memuat data</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : data === null ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className={cn(
                                            "h-24 text-center",
                                            bodyBgStyles
                                        )}
                                    >
                                        <div className="flex items-center justify-center">
                                            <Loader2 className={cn(
                                                "h-6 w-6 animate-spin",
                                                mutedTextStyles
                                            )} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row, rowIndex) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className={cn(
                                            "transition-colors group",
                                            bodyBgStyles,
                                            rowHoverStyles
                                        )}
                                    >
                                        {row.getVisibleCells().map((cell) => {
                                            const isPinned = cell.column.getIsPinned();
                                            const pinningStyles = isPinned
                                                ? isPinned === "right"
                                                    ? cn(
                                                        "sticky right-0 z-10",
                                                        pinnedBgStyles,
                                                        pinnedHoverStyles
                                                    )
                                                    : cn(
                                                        "sticky left-0 z-10",
                                                        pinnedBgStyles,
                                                        pinnedHoverStyles
                                                    )
                                                : "";

                                            const shouldMerge = mergeColumns.includes(cell.column.id);
                                            const spanInfo = shouldMerge ? rowSpanData[cell.column.id][rowIndex] : { show: true, rowspan: 1 };

                                            if (shouldMerge && !spanInfo.show) {
                                                return null;
                                            }

                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    className={cn(
                                                        "p-2.5 whitespace-nowrap transition-colors",
                                                        borderStyles,
                                                        textStyles,
                                                        pinningStyles,
                                                        shouldMerge && "align-middle text-center justify-center border-x"
                                                    )}
                                                    rowSpan={shouldMerge ? spanInfo.rowspan : 1}
                                                >
                                                    <div className={shouldMerge ? 'flex items-center justify-center' : ''}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </div>
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className={cn(
                                            "h-24 text-center",
                                            mutedTextStyles,
                                            bodyBgStyles
                                        )}
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination
                table={table}
                loading={isLoading}
                serverSide={serverSide}
                meta={meta}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
            />
        </div>
    );
}

export default DataTable;