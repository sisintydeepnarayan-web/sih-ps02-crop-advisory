/**
 * Lightweight API client for communicating with the backend
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Backend health check warning:', error.message);
    return { status: 'offline', error: error.message };
  }
}

export default {
  checkBackendHealth,
  API_BASE_URL,
};
