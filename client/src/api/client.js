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

/**
 * Creates a new farmer profile in Supabase via backend API (INSERT)
 * @param {Object} farmerData - { name, district, state, primary_crop, land_size, loan_due_date, preferred_language }
 * @returns {Promise<Object>} The created farmer object from Supabase
 */
export async function createFarmer(farmerData) {
  const response = await fetch(`${API_BASE_URL}/api/farmers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(farmerData),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || result.message || `Server error: ${response.status}`);
  }
  return result.data;
}

/**
 * Updates an existing farmer profile in Supabase via backend API (UPDATE)
 * @param {string} id - The farmer's UUID
 * @param {Object} farmerData - { name, district, state, primary_crop, land_size, loan_due_date, preferred_language }
 * @returns {Promise<Object|null>} The updated farmer object, or null if farmer was not found (e.g. deleted)
 */
export async function updateFarmer(id, farmerData) {
  if (!id) return null;
  try {
    const response = await fetch(`${API_BASE_URL}/api/farmers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(farmerData),
    });

    if (response.status === 404) {
      // Farmer row does not exist in DB
      return null;
    }

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || result.message || `Server error: ${response.status}`);
    }
    return result.data || null;
  } catch (err) {
    console.warn(`Update failed for farmer ID ${id}:`, err.message);
    throw err;
  }
}

/**
 * Fetches a farmer profile by ID.
 * Returns null gracefully if no matching farmer exists.
 * @param {string} id - The farmer's UUID
 * @returns {Promise<Object|null>}
 */
export async function getFarmerById(id) {
  if (!id) return null;
  try {
    const response = await fetch(`${API_BASE_URL}/api/farmers/${id}`);
    if (response.status === 404) {
      // Farmer no longer exists in database
      return null;
    }

    const result = await response.json();
    if (!response.ok) {
      return null;
    }
    return result.data || null;
  } catch (error) {
    console.warn(`Could not fetch farmer with ID ${id}:`, error.message);
    return null;
  }
}

/**
 * Fetches rule-based crop advisory recommendations from backend engine
 * @param {string} district - District name
 * @param {string} crop - Crop identifier (e.g. 'wheat', 'cotton')
 * @returns {Promise<Object>} The structured advisory object
 */
export async function fetchCropAdvisory(district, crop) {
  const params = new URLSearchParams();
  if (district) params.append('district', district);
  if (crop) params.append('crop', crop);

  const response = await fetch(`${API_BASE_URL}/api/advisory?${params.toString()}`);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || `Failed to fetch advisory: ${response.status}`);
  }
  return result.data;
}

export default {
  checkBackendHealth,
  createFarmer,
  updateFarmer,
  getFarmerById,
  fetchCropAdvisory,
  API_BASE_URL,
};
