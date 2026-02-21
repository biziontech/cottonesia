"use client";

import { useState, useEffect } from 'react';
import { usePagination } from '@/contexts/PaginationContext';
import { toast } from 'sonner'; // atau toast library yang Anda pakai

export function useBasePagination(key, fetchFunction, initialPage = 1) {
    const { updatePagination, getPagination } = usePagination();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(initialPage);

    const fetchData = async (page) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetchFunction(page);
            // Cek apakah response success (sesuai struktur API Anda)
            if (response?.success) {
                updatePagination(key, response.data);
                setCurrentPage(page);
                setError(null);
            } else {
                setError(response?.message || 'Failed to fetch data');
                toast.error(response?.message || 'Error loading data');
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
            toast.error('Error loading data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
    }, []);

    const goToPage = (page) => {
        if (page >= 1) {
            fetchData(page);
        }
    };

    const nextPage = () => {
        const pagination = getPagination(key);
        if (pagination?.nextPageUrl) {
            fetchData(currentPage + 1);
        }
    };

    const prevPage = () => {
        const pagination = getPagination(key);
        if (pagination?.prevPageUrl) {
            fetchData(currentPage - 1);
        }
    };

    const refresh = () => {
        fetchData(currentPage);
    };

    return {
        data: getPagination(key),
        loading,
        error,
        currentPage,
        goToPage,
        nextPage,
        prevPage,
        refresh
    };
}