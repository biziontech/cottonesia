import { Badge } from "@/components/ui/badge";
import Actions from "./actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DataTableColumnHeader from "@/components/data-table/DataTableColumnHeader";


const Columns = [
    {
        id: "rowNumber",
        header: "No.",
        headClassName: "w-14 text-center",
        cell: ({ row, table }) => {
            // Untuk server-side pagination, hitung nomor berdasarkan page
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
        accessorKey: "full_name",
        header: ({ column, table }) => (
            <DataTableColumnHeader
                column={column}
                title="Nama Lengkap"
                serverSide={table.options.meta?.serverSide}
                onSort={table.options.meta?.onSort}
                sortField="full_name"
            />
        ),
        cell: ({ row }) => (
            <div className="flex gap-2 items-center">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt={row.original?.full_name} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-medium">{row.original?.full_name}</span>
                    <small className="text-gray-500">{row.original?.email}</small>
                </div>
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
        enableFiltering: false,
    },
    {
        accessorKey: "roles",
        header: ({ column, table }) => (
            <DataTableColumnHeader
                column={column}
                title="Roles"
                serverSide={table.options.meta?.serverSide}
                onSort={table.options.meta?.onSort}
                sortField="roles"
            />
        ),
        cell: ({ row }) => (
            <div className="flex gap-1">
                {row?.original?.roles_name.length > 0 ? row?.original?.roles_name.map((role, index) => {
                    return (<Badge key={index} variant="outline" className='rounded-md'>{role}</Badge>)
                }) : '-'}
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
        enableFiltering: false,
    },
    {
        accessorKey: "whatsapp_no",
        header: ({ column, table }) => (
            <DataTableColumnHeader
                column={column}
                title="No Whatsapp"
                serverSide={table.options.meta?.serverSide}
                onSort={table.options.meta?.onSort}
                sortField="whatsapp_no"
            />
        ),
        cell: ({ row }) => (
            <div className="font-medium">{row.original?.whatsapp_no ?? '-'}</div>
        ),
        enableSorting: false,
        enableHiding: false,
        enableFiltering: false,
    },
    {
        accessorKey: "gender",
        header: ({ column, table }) => (
            <DataTableColumnHeader
                column={column}
                title="Gender"
                serverSide={table.options.meta?.serverSide}
                onSort={table.options.meta?.onSort}
                sortField="gender"
            />
        ),
        cell: ({ row }) => (
            <div className="font-medium">{row.original?.gender_label ?? '-'}</div>
        ),
        enableSorting: false,
        enableHiding: false,
        enableFiltering: false,
    },
    {
        accessorKey: "email",
        header: ({ column, table }) => (
            <DataTableColumnHeader
                column={column}
                title="Email"
                serverSide={table.options.meta?.serverSide}
                onSort={table.options.meta?.onSort}
                sortField="email"
            />
        ),
        cell: ({ row }) => (
            <div className="font-medium">{row.original?.email ?? '-'}</div>
        ),
        enableSorting: false,
        enableHiding: false,
        enableFiltering: false,
    },
    {
        accessorKey: "status",
        header: ({ column, table }) => (
            <DataTableColumnHeader
                column={column}
                title="Status"
                serverSide={table.options.meta?.serverSide}
                onSort={table.options.meta?.onSort}
                sortField="status"
            />
        ),
        cell: ({ row }) => (
            <>
                {row.original?.status == 1 ? (
                    <Badge variant="success" className="font-medium rounded-md shadow-md shadow-emerald-300/40">{row.original?.status_label ?? '-'}</Badge>
                ) : row?.original?.status == 2 ? (
                    <Badge variant="danger" className="font-medium rounded-md shadow-md shadow-rose-300/40">{row.original?.status_label ?? '-'}</Badge>
                ) : ('-')}
            </>

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