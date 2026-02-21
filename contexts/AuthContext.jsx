'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { toast } from 'sonner';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userType, setUserType] = useState(null);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // ✅ Ambil dari cookies
            const token = api.getCookie('token');
            const storedUserType = api.getCookie('userType');

            if (!token || !storedUserType) {
                setLoading(false);
                return;
            }

            const endpoint = storedUserType === 'admin' ? api.adminMe : api.siswaMe;
            const data = await api.fetch(endpoint);

            const userData = data.data?.admin || data.data?.siswa || data.data;
            setUser(userData);
            setUserType(storedUserType);
        } catch {
            // delete cookies
            api.deleteCookie('token');
            api.deleteCookie('userType');
            // set user
            setUser(null);
            setUserType(null);
        } finally {
            setLoading(false);
        }
    };

    const loginAdmin = async (email, password, recaptchaToken) => {
        try {
            const response = await api.fetch(api.adminLogin, {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password,
                    recaptcha_token: recaptchaToken
                }),
            });

            if (!response.success) {
                throw response;
            }

            const { data } = response;
            const token = data.token;
            const adminData = data.admin;

            // ✅ Simpan ke cookies saja
            api.setCookie('token', token, 7);
            api.setCookie('userType', 'admin', 7);

            setUser(adminData);
            setUserType('admin');

            return { success: true, data: response };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                errors: error.errors
            };
        }
    };

    const loginSiswa = async (email, password, recaptchaToken) => {
        try {
            const response = await api.fetch(api.siswaLogin, {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password,
                    recaptcha_token: recaptchaToken
                }),
            });

            if (!response.success) {
                throw response;
            }

            const { data } = response;
            const token = data.token;
            const siswaData = data.siswa || data.student;

            // ✅ Simpan ke cookies saja
            api.setCookie('token', token, 7);
            api.setCookie('userType', 'siswa', 7);

            setUser(siswaData);
            setUserType('siswa');

            return { success: true, data: response };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                errors: error.errors
            };
        }
    };

    const logout = async () => {
        try {
            const endpoint = userType === 'admin' ? api.adminLogout : api.siswaLogout;
            await api.fetch(endpoint, { method: 'POST' });
        } catch {
            toast.error("Gagal Logout")
        } finally {
            const redirectPath = userType === 'admin'
                ? '/'
                : '/';

            api.deleteCookie('token');
            api.deleteCookie('userType');

            setUser(null);
            setUserType(null);

            toast.info("Berhasil Logout")

            router.push(redirectPath);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            userType,
            loginAdmin,
            loginSiswa,
            logout,
            loading,
            checkAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};