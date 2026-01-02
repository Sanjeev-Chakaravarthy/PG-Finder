// src/config/api.ts
// API Configuration with multiple fallbacks

// Check if we're in production (deployed on Vercel)
const isProduction = window.location.hostname !== 'localhost' && 
                    window.location.hostname !== '127.0.0.1';

// Determine the API URL
export const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  (isProduction 
    ? 'https://pg-haven.onrender.com'  // Production backend
    : 'http://localhost:5001'           // Local backend
  );

// Log for debugging (remove in production if needed)
console.log('🌍 Environment:', isProduction ? 'Production' : 'Development');
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🏠 Frontend Host:', window.location.hostname);

export default API_BASE_URL;