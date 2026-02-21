import { configureEcho } from "@laravel/echo-react";
import { api } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Initialize Echo configuration for WebSocket connections
 * @param {string} modelType - Type of model ('user' or 'admin')
 * @returns {void}
 */
export const initializeEcho = (modelType = 'user') => {
    const authEndpoint = modelType === 'admin'
        ? `${API_URL}/broadcasting/auth/admin`
        : `${API_URL}/broadcasting/auth/user`;

    configureEcho({
        broadcaster: 'reverb',
        key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
        wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
        wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080,
        wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080,
        forceTLS: false,
        enabledTransports: ['ws', 'wss'],
        authEndpoint: authEndpoint,
        bearerToken: api.token
    });
};

/**
 * Get channel name based on user UUID and model type
 * @param {string} userUuid - User UUID
 * @param {string} modelType - Type of model ('user' or 'admin')
 * @returns {string} Channel name
 */
export const getChannelName = (userUuid, modelType = 'user') => {
    return modelType === 'admin'
        ? `admins.${userUuid}`
        : `users.${userUuid}`;
};

/**
 * Get conversion channel name
 * @param {string} uuid - Module/Training UUID
 * @returns {string} Channel name
 */
export const getConversionChannel = (uuid) => {
    return `conversion.${uuid}`;
};

/**
 * Broadcast configuration object
 */
export const broadcast = {
    /**
     * Initialize Echo configuration
     */
    init: initializeEcho,

    /**
     * Get channel name
     */
    getChannel: getChannelName,

    /**
     * Get conversion channel name
     */
    getConversionChannel: getConversionChannel,

    /**
     * Events constant
     */
    events: {
        NOTIFICATION_NEW: 'notification.new',
        CONVERSION_PROGRESS: 'progress.updated'
    }
};

export default broadcast;