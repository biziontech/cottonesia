'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

const SettingsContext = createContext({});

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = useCallback(async () => {
        try {
            const data = await api.fetch(api.settings); // GET /api/settings
            setSettings(data.data);
        } catch {
            setSettings(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateSettings = async (payload) => {
        try {
            const data = await api.fetch(api.updateSettings, {
                method: 'PUT',
                body: JSON.stringify(payload),
            });

            if (!data.success) throw data;

            setSettings(data.data);
            toast.success('Settings berhasil disimpan!');
            return { success: true, data: data.data };
        } catch (error) {
            toast.error('Gagal menyimpan settings.');
            return {
                success: false,
                message: error.message,
                errors: error.errors,
            };
        }
    };

    return (
        <SettingsContext.Provider value={{
            settings,
            loading,
            fetchSettings,
            updateSettings,
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
};