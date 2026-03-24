const API_URL = process.env.NEXT_PUBLIC_API_URL;

const setCookie = (name, value, days = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name) => {
    if (typeof document === 'undefined') return null;

    const nameEQ = name + "=";
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

const deleteCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

export const api = {
    adminMenu: `${API_URL}/office/menu/list`,
    adminLogin: `${API_URL}/office/auth/login`,
    adminLogout: `${API_URL}/office/auth/logout`,
    adminMe: `${API_URL}/office/auth/me`,
    adminDashboard: `${API_URL}/office/dashboard`,

    settings: `${API_URL}/office/settings`,
    updateSettings: `${API_URL}/office/settings`,

    token: getCookie('token'),

    // ✅ Fetch dengan cookies only
    async fetch(endpoint, options = {}) {
        const token = getCookie('token');

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        };

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(endpoint, config);
            const data = await response.json();

            return data;
        } catch (error) {
            if (error.status === 401) {
                const userType = getCookie('userType');

                deleteCookie('token');
                deleteCookie('userType');

                if (typeof window !== 'undefined') {
                    if (userType === 'admin') {
                        window.location.href = '/app/auth/panel/login';
                    } else if (userType === 'siswa') {
                        window.location.href = '/app/auth/academy/login';
                    }
                }
            }

            throw error;
        }
    },

    setCookie,
    getCookie,
    deleteCookie
};

export default api;