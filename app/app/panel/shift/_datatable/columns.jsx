import { Badge } from "@/components/ui/badge";
import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";
import Actions from "./actions";

const formatTime = (value) => {
    if (!value) return "-";

    return value.slice(0, 5);
};

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
                title="Nama Shift"
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
        accessorKey: "start_time",
        header: ({ column, table }) => (
            <DataTableColumnHeader
                column={column}
                title="Jam Mulai"
                serverSide={table.options.meta?.serverSide}
                onSort={table.options.meta?.onSort}
                sortField="start_time"
            />
        ),
        cell: ({ row }) => (
            <div className="font-medium">{formatTime(row.original?.start_time)}</div>
        ),
        enableSorting: false,
        enableHiding: false,
        enableFiltering: false,
    },
    {
        accessorKey: "end_time",
        header: ({ column, table }) => (
            <DataTableColumnHeader
                column={column}
                title="Jam Selesai"
                serverSide={table.options.meta?.serverSide}
                onSort={table.options.meta?.onSort}
                sortField="end_time"
            />
        ),
        cell: ({ row }) => (
            <div className="font-medium">{formatTime(row.original?.end_time)}</div>
        ),
        enableSorting: false,
        enableHiding: false,
        enableFiltering: false,
    },
    {
        accessorKey: "cross_day",
        header: ({ column, table }) => (
            <DataTableColumnHeader
                column={column}
                title="Lintas Hari"
                serverSide={table.options.meta?.serverSide}
                onSort={table.options.meta?.onSort}
                sortField="cross_day"
            />
        ),
        cell: ({ row }) => (
            row.original?.cross_day ? (
                <Badge variant="success" className="rounded-md">Ya</Badge>
            ) : (
                <Badge variant="outline" className="rounded-md">Tidak</Badge>
            )
        ),
        enableSorting: false,
        enableHiding: false,
        enableFiltering: false,
    },
    {
        accessorKey: "is_active",
        header: ({ column, table }) => (
            <DataTableColumnHeader
                column={column}
                title="Status"
                serverSide={table.options.meta?.serverSide}
                onSort={table.options.meta?.onSort}
                sortField="is_active"
            />
        ),
        cell: ({ row }) => (
            row.original?.is_active ? (
                <Badge variant="success" className="rounded-md">Aktif</Badge>
            ) : (
                <Badge variant="outline" className="rounded-md">Nonaktif</Badge>
            )
        ),
        enableSorting: false,
        enableHiding: false,
        enableFiltering: false,
    },
    {
        accessorKey: "late_tolerance_minutes",
        header: ({ column, table }) => (
            <DataTableColumnHeader
                column={column}
                title="Toleransi"
                serverSide={table.options.meta?.serverSide}
                onSort={table.options.meta?.onSort}
                sortField="late_tolerance_minutes"
            />
        ),
        cell: ({ row }) => (
            <div className="font-medium">{row.original?.late_tolerance_minutes ?? 0} menit</div>
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
