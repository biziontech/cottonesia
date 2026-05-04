'use client';

import PageTitle from '@/components/partials/PageTitle';
import LayoutContainer from '@/components/partials/LayoutContainer';
import { useServerPagination } from '@/hooks/use-server-pagination';
import DataTable from "@/components/data-table/Datatable";
import Toolbar from './_datatable/toolbar';
import Columns from './_datatable/columns';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Page() {
    const {
        data,
        meta,
        error,
        params,
        onPageChange,
        onPageSizeChange,
        onSearch,
        onFilter,
        onSort,
        refresh
    } = useServerPagination(`${API_URL}/office/departments`, {
        per_page: '10',
        sort_by: 'id',
        sort_order: 'desc'
    });

    return (
        <LayoutContainer>
            <div className='max-w-6xl mx-auto w-full mb-10'>
                <PageTitle title="Daftar Department" subtitle="Kelola department dan anggota di dalamnya" />

                {!error ? (
                    <DataTable
                        variant='outline'
                        columns={Columns}
                        rowHeight={52.4}
                        data={data}
                        meta={meta}
                        error={error}
                        serverSide={true}
                        onPageChange={onPageChange}
                        onPageSizeChange={onPageSizeChange}
                        onRefresh={refresh}
                        toolbar={(props) => (
                            <Toolbar
                                {...props}
                                params={params}
                                onSearch={onSearch}
                                onFilter={onFilter}
                                onSort={onSort}
                                onRefresh={refresh}
                            />
                        )}
                        react_table={{
                            onSort: onSort,
                        }}
                    />
                ) : (
                    <div className='w-full flex items-center justify-center h-96'>
                        <p className='text-xs font-medium'>{error}</p>
                    </div>
                )}
            </div>
        </LayoutContainer>
    )
};
