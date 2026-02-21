import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

export function useServerPagination(apiUrl, defaultParams = {}) {
    const [data, setData] = useState(null);
    const [meta, setMeta] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // State untuk semua params (tidak sync dengan URL)
    const [params, setParams] = useState({
        page: defaultParams.page || '1',
        per_page: defaultParams.per_page || '10',
        search: defaultParams.search || '',
        sort_by: defaultParams.sort_by || 'id',
        sort_order: defaultParams.sort_order || 'desc',
        ...defaultParams
    });

    // Fetch data dari API
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Build query string untuk API, exclude empty values
            const queryParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== '' && value !== null && value !== undefined) {
                    queryParams.append(key, value);
                }
            });
            // response
            const response = await api.fetch(`${apiUrl}?${queryParams.toString()}`);
            // jawab daa
            if (!response.hasOwnProperty('data')) {
                throw new Error(response?.message);
            }
            // result
            const result = response;
            // Support Laravel paginate format
            setData(result.data || []);
            setMeta({
                current_page: result.current_page || 1,
                last_page: result.last_page || 1,
                per_page: result.per_page || 10,
                total: result.total || 0,
                from: result.from || 0,
                to: result.to || 0,
            });

        } catch (err) {
            setError(err.message);
            setData([]);
            setMeta(null);
        } finally {
            setLoading(false);
        }
    }, [apiUrl, params]);

    // Update params (hanya update state, tidak touch URL)
    const updateParams = useCallback((newParams) => {
        setParams(prev => ({ ...prev, ...newParams }));
    }, []);

    // Handler functions
    const handlers = {
        onPageChange: (page) => updateParams({ page: page.toString() }),
        onPageSizeChange: (size) => updateParams({ per_page: size.toString(), page: '1' }),
        onSearch: (search) => updateParams({ search, page: '1' }),
        onSort: (sortBy, sortOrder) => updateParams({ sort_by: sortBy, sort_order: sortOrder }),
        onFilter: (filters) => updateParams({ ...filters, page: '1' }),
        refresh: fetchData,
    };

    // Fetch saat params berubah
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // refresh saat ada notifikasi 
    useEffect(() => {
        const handler = (e) => {
            // refresh
            const notification = e?.detail;
            // reload notification
            if (notification) {
                fetchData();
            }
        };
        // mendengar notifikasi
        window.addEventListener('notification:new', handler);
        // return
        return () => window.removeEventListener('notification:new', handler);
    }, [fetchData]);

    return {
        data,
        meta,
        error,
        loading,
        params,
        ...handlers
    };
}