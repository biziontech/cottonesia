import { Badge } from "@/components/ui/badge";
import Actions from "./actions";
import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";

const Columns = [
    {
        id: "rowNumber",
        header: "No.",
        headClassName: "w-14 text-center",
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const rowNumber = (pageIndex * pageSize) + row.index + 1;

            return (
                <div className="text-gray-800 dark:text-gray-100 font-medium text-center">
                    <span>{rowNumber}</span>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column, table }) => (
            <DataTableColumnHeader
                column={column}
                title="Nama Department"
                serverSide={table.options.meta?.serverSide}
                onSort={table.options.meta?.onSort}
                sortField="name"
            />
        ),
        cell: ({ row }) => (
            <div className="font-medium">{row.original?.name ?? "-"}</div>
        ),
        enableSorting: false,
        enableHiding: false,
        enableFiltering: false,
    },
    {
        accessorKey: "description",
        header: "Deskripsi",
        cell: ({ row }) => (
            <div className="max-w-md truncate text-sm text-muted-foreground">
                {row.original?.description ?? "-"}
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
        enableFiltering: false,
    },
    {
        accessorKey: "admins_count",
        header: "Jumlah User",
        cell: ({ row }) => (
            <Badge variant="outline" className="rounded-md">
                {row.original?.admins_count ?? 0} user
            </Badge>
        ),
        enableSorting: false,
        enableHiding: false,
        enableFiltering: false,
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row, table }) => <Actions row={row} table={table} />,
        enableSorting: false,
        enableHiding: false,
    },
];

export default Columns;
