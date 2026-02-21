"use client";

import { createContext, useContext, useState, useCallback } from 'react';

const PaginationContext = createContext(undefined);

export function PaginationProvider({ children }) {
    const [paginationData, setPaginationData] = useState({});

    const updatePagination = useCallback((key, data) => {
        setPaginationData(prev => ({
            ...prev,
            [key]: {
                currentPage: data.current_page,
                data: data.data,
                firstPageUrl: data.first_page_url,
                from: data.from,
                lastPage: data.last_page,
                lastPageUrl: data.last_page_url,
                links: data.links,
                nextPageUrl: data.next_page_url,
                path: data.path,
                perPage: data.per_page,
                prevPageUrl: data.prev_page_url,
                to: data.to,
                total: data.total
            }
        }));
    }, []);

    const getPagination = useCallback((key) => {
        return paginationData[key] || null;
    }, [paginationData]);

    const clearPagination = useCallback((key) => {
        setPaginationData(prev => {
            const newData = { ...prev };
            delete newData[key];
            return newData;
        });
    }, []);

    return (
        <PaginationContext.Provider value={{
            updatePagination,
            getPagination,
            clearPagination
        }}>
            {children}
        </PaginationContext.Provider>
    );
}

export function usePagination() {
    const context = useContext(PaginationContext);
    if (context === undefined) {
        throw new Error('usePagination must be used within a PaginationProvider');
    }
    return context;
}
