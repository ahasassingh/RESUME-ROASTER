// Helper to strip trailing slash
const cleanUrl = (url) => url ? url.replace(/\/$/, '') : '';

export const API_BASE_URL = cleanUrl(import.meta.env.VITE_API_URL) || 'http://localhost:5000';
