import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeClosed } from "lucide-react";

const DataTableColumnHeader = ({
    column,
    title,
    className,
    serverSide = false,    // Flag untuk server-side mode
    onSort = null,         // Callback untuk server-side sorting
    sortField = null,      // Field name untuk server-side (default: column.id)
}) => {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>;
    }

    // Handle sort untuk server-side atau client-side
    const handleSort = (isDesc) => {
        if (serverSide && onSort) {
            // Server-side sorting
            const field = sortField || column.id;
            const order = isDesc ? 'desc' : 'asc';
            onSort(field, order);
        } else {
            // Client-side sorting (existing behavior)
            column.toggleSorting(isDesc);
        }
    };

    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 data-[state=open]:bg-accent"
                    >
                        <span>{title}</span>
                        {column.getIsSorted() === 'desc' ? (
                            <ArrowDown className="h-4 w-4" />
                        ) : column.getIsSorted() === 'asc' ? (
                            <ArrowUp className="h-4 w-4" />
                        ) : (
                            <ChevronsUpDown className="h-4 w-4" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => handleSort(false)}>
                        <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort(true)}>
                        <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
                        Desc
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                        <EyeClosed className="h-3.5 w-3.5 text-muted-foreground/70" />
                        Hide
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default DataTableColumnHeader;