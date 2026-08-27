/**
 * ==============================================================================
 * SUPABASE CRUD HELPER FUNCTIONS
 * ==============================================================================
 *
 * This file contains simple, beginner-friendly helper functions to interact with
 * your PostgreSQL database using the Supabase JavaScript Client.
 *
 * Key Supabase query builder concepts used below:
 * - `.from('table_name')`: Specifies which table to query.
 * - `.select('*')`: Requests columns. Supabase automatically handles JSON serialization.
 * - `.insert(data).select()`: Inserts one or more rows. Adding `.select()` returns the newly inserted row(s).
 * - `.eq('column', value)`: Filters where column equals value (=).
 * - `.order('column', { ascending: false })`: Sorts query results.
 * - `.limit(n)`: Limits the number of returned records.
 * - `.maybeSingle()`: Returns a single object or null if not found (safer than .single() which throws on 0 rows).
 * - `.ilike('column', '%pattern%')`: Case-insensitive pattern matching.
 * - `.or('condition1,condition2')`: Logical OR filtering.
 */

const { supabase } = require('./supabaseClient');

// ------------------------------------------------------------------------------
// 1. FARMERS HELPERS
// ------------------------------------------------------------------------------

/**
 * Inserts a new farmer profile into the 'farmers' table.
 *
 * @param {Object} data - Farmer data object:
 *   { name, district, state, primary_crop, land_size, loan_due_date, preferred_language }
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 *
 * Example usage:
 * const { data, error } = await insertFarmer({
 *   name: 'Ramesh Kumar',
 *   district: 'Varanasi',
 *   state: 'Uttar Pradesh',
 *   primary_crop: 'wheat',
 *   land_size: 3.5,
 *   loan_due_date: '2026-11-30',
 *   preferred_language: 'hi'
 * });
 */
async function insertFarmer(data) {
  try {
    // .insert(data) writes the row.
    // .select().single() returns the inserted row as a single object (including the generated UUID and created_at).
    const { data: farmer, error } = await supabase
      .from('farmers')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return { data: farmer, error: null };
  } catch (error) {
    console.error('Error in insertFarmer:', error.message);
    return { data: null, error };
  }
}

/**
 * Retrieves a single farmer profile by their UUID.
 *
 * @param {string} id - The farmer's UUID
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
async function getFarmerById(id) {
  try {
    // .maybeSingle() retrieves 1 row or null if not found, preventing unnecessary 406 errors.
    const { data: farmer, error } = await supabase
      .from('farmers')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return { data: farmer, error: null };
  } catch (error) {
    console.error('Error in getFarmerById:', error.message);
    return { data: null, error };
  }
}

// ------------------------------------------------------------------------------
// 2. CROP PRICES HELPERS
// ------------------------------------------------------------------------------

/**
 * Retrieves crop prices filtered by crop name and district, ordered by latest date.
 *
 * @param {string} crop - Crop name (e.g., 'wheat', 'mustard')
 * @param {string} district - District name (e.g., 'Varanasi', 'Agra')
 * @returns {Promise<{ data: Array|null, error: Object|null }>}
 */
async function getPricesByCropAndDistrict(crop, district) {
  try {
    let query = supabase
      .from('crop_prices')
      .select('*')
      .order('date', { ascending: false });

    // Apply case-insensitive filter for crop if provided
    if (crop) {
      query = query.ilike('crop_name', `%${crop}%`);
    }

    // Apply case-insensitive filter for district if provided
    if (district) {
      query = query.ilike('district', `%${district}%`);
    }

    const { data: prices, error } = await query;

    if (error) throw error;
    return { data: prices || [], error: null };
  } catch (error) {
    console.error('Error in getPricesByCropAndDistrict:', error.message);
    return { data: null, error };
  }
}

/**
 * Inserts a single crop price entry into 'crop_prices'.
 *
 * @param {Object} data - { crop_name, district, price_per_quintal, date }
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
async function insertPriceEntry(data) {
  try {
    const { data: priceEntry, error } = await supabase
      .from('crop_prices')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return { data: priceEntry, error: null };
  } catch (error) {
    console.error('Error in insertPriceEntry:', error.message);
    return { data: null, error };
  }
}

// ------------------------------------------------------------------------------
// 3. WEATHER SNAPSHOTS HELPERS
// ------------------------------------------------------------------------------

/**
 * Retrieves a weather snapshot for a given district and specific date.
 * If date is omitted, it defaults to the latest snapshot available for that district.
 *
 * @param {string} district - District name
 * @param {string} [date] - Optional date in 'YYYY-MM-DD' format
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
async function getWeatherSnapshot(district, date) {
  try {
    let query = supabase
      .from('weather_snapshots')
      .select('*')
      .ilike('district', district);

    if (date) {
      query = query.eq('date', date);
    } else {
      query = query.order('date', { ascending: false }).limit(1);
    }

    const { data: snapshot, error } = await query.maybeSingle();

    if (error) throw error;
    return { data: snapshot, error: null };
  } catch (error) {
    console.error('Error in getWeatherSnapshot:', error.message);
    return { data: null, error };
  }
}

/**
 * Inserts a new daily weather record or alert into 'weather_snapshots'.
 *
 * @param {Object} data - { district, date, rainfall_mm, expected_rainfall_mm, temp_c, alert_type }
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
async function insertWeatherSnapshot(data) {
  try {
    const { data: weather, error } = await supabase
      .from('weather_snapshots')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return { data: weather, error: null };
  } catch (error) {
    console.error('Error in insertWeatherSnapshot:', error.message);
    return { data: null, error };
  }
}

// ------------------------------------------------------------------------------
// 4. SCHEMES HELPERS
// ------------------------------------------------------------------------------

/**
 * Retrieves all government agricultural schemes.
 *
 * @returns {Promise<{ data: Array|null, error: Object|null }>}
 */
async function getAllSchemes() {
  try {
    const { data: schemes, error } = await supabase
      .from('schemes')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return { data: schemes || [], error: null };
  } catch (error) {
    console.error('Error in getAllSchemes:', error.message);
    return { data: null, error };
  }
}

/**
 * Searches schemes by matching a query against name, description, or eligibility.
 *
 * @param {string} query - Keyword to search (e.g., 'insurance', 'subsidy', 'credit')
 * @returns {Promise<{ data: Array|null, error: Object|null }>}
 */
async function searchSchemes(query) {
  try {
    if (!query || query.trim() === '') {
      return await getAllSchemes();
    }

    const cleanQuery = query.trim();
    // Using .or() to search multiple text columns with case-insensitive matching (.ilike)
    const { data: schemes, error } = await supabase
      .from('schemes')
      .select('*')
      .or(
        `name.ilike.%${cleanQuery}%,description.ilike.%${cleanQuery}%,eligibility.ilike.%${cleanQuery}%`
      );

    if (error) throw error;
    return { data: schemes || [], error: null };
  } catch (error) {
    console.error('Error in searchSchemes:', error.message);
    return { data: null, error };
  }
}

// ------------------------------------------------------------------------------
// 5. DISTRESS SCORES HELPERS
// ------------------------------------------------------------------------------

/**
 * Inserts a computed distress risk score for a farmer.
 *
 * @param {Object} data - { farmer_id, score (0-100), risk_level ('low'|'medium'|'high'), triggered_factors (JSON) }
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
async function insertDistressScore(data) {
  try {
    const { data: scoreEntry, error } = await supabase
      .from('distress_scores')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return { data: scoreEntry, error: null };
  } catch (error) {
    console.error('Error in insertDistressScore:', error.message);
    return { data: null, error };
  }
}

/**
 * Retrieves the most recent distress score and risk level for a given farmer.
 *
 * @param {string} farmerId - The UUID of the farmer
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
async function getLatestDistressScore(farmerId) {
  try {
    const { data: score, error } = await supabase
      .from('distress_scores')
      .select('*')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return { data: score, error: null };
  } catch (error) {
    console.error('Error in getLatestDistressScore:', error.message);
    return { data: null, error };
  }
}

// ------------------------------------------------------------------------------
// 6. MOOD CHECKINS HELPERS
// ------------------------------------------------------------------------------

/**
 * Inserts a daily mood / psychological sentiment check-in for a farmer.
 *
 * @param {Object} data - { farmer_id, mood ('good'|'okay'|'struggling'), date }
 * @returns {Promise<{ data: Object|null, error: Object|null }>}
 */
async function insertMoodCheckin(data) {
  try {
    const { data: checkin, error } = await supabase
      .from('mood_checkins')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return { data: checkin, error: null };
  } catch (error) {
    console.error('Error in insertMoodCheckin:', error.message);
    return { data: null, error };
  }
}

/**
 * Retrieves the historical log of mood check-ins for a farmer, sorted chronologically.
 *
 * @param {string} farmerId - The UUID of the farmer
 * @returns {Promise<{ data: Array|null, error: Object|null }>}
 */
async function getMoodHistory(farmerId) {
  try {
    const { data: history, error } = await supabase
      .from('mood_checkins')
      .select('*')
      .eq('farmer_id', farmerId)
      .order('date', { ascending: false });

    if (error) throw error;
    return { data: history || [], error: null };
  } catch (error) {
    console.error('Error in getMoodHistory:', error.message);
    return { data: null, error };
  }
}

// ==============================================================================
// MODULE EXPORTS
// ==============================================================================
module.exports = {
  // Farmers
  insertFarmer,
  getFarmerById,

  // Crop Prices
  getPricesByCropAndDistrict,
  insertPriceEntry,

  // Weather Snapshots
  getWeatherSnapshot,
  insertWeatherSnapshot,

  // Schemes Directory
  getAllSchemes,
  searchSchemes,

  // Distress Scores
  insertDistressScore,
  getLatestDistressScore,

  // Mood Checkins
  insertMoodCheckin,
  getMoodHistory,
};
