/**
 * Helper utilities for Farmer Web App
 */

// Format INR currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Indian agricultural states & sample districts for fast onboarding
export const STATE_DISTRICTS = {
  'Maharashtra': ['Nashik', 'Pune', 'Nagpur', 'Aurangabad', 'Solapur', 'Kolhapur', 'Amravati', 'Latur', 'Yavatmal', 'Ahmednagar'],
  'Uttar Pradesh': ['Lucknow', 'Varanasi', 'Gorakhpur', 'Meerut', 'Agra', 'Kanpur', 'Prayagraj', 'Bareilly'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Ujjain', 'Jabalpur', 'Sehore', 'Vidisha', 'Gwalior', 'Dewas'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Patiala', 'Bathinda', 'Jalandhar', 'Sangrur', 'Ferozepur', 'Hoshiarpur'],
  'Haryana': ['Karnal', 'Hisar', 'Ambala', 'Rohtak', 'Kurukshetra', 'Sirsa', 'Panipat', 'Sonipat'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Sri Ganganagar', 'Alwar', 'Bikaner', 'Udaipur', 'Barmer'],
  'Bihar': ['Patna', 'Muzaffarpur', 'Gaya', 'Bhagalpur', 'Darbhanga', 'Samastipur', 'Rohtas', 'Nalanda'],
};

// Major crops list with English, Hindi, and Marathi names
export const MAJOR_CROPS = [
  { id: 'wheat', en: 'Wheat', hi: 'गेहूँ', mr: 'गहू' },
  { id: 'rice', en: 'Paddy / Rice', hi: 'धान / चावल', mr: 'भात / तांदूळ' },
  { id: 'mustard', en: 'Mustard', hi: 'सरसों', mr: 'मोहरी' },
  { id: 'cotton', en: 'Cotton', hi: 'कपास', mr: 'कापूस' },
  { id: 'maize', en: 'Maize / Corn', hi: 'मक्का', mr: 'मका' },
  { id: 'sugarcane', en: 'Sugarcane', hi: 'गन्ना', mr: 'ऊस' },
  { id: 'potato', en: 'Potato', hi: 'आलू', mr: 'बटाटा' },
  { id: 'soybean', en: 'Soybean', hi: 'सोयाबीन', mr: 'सोयाबीन' },
  { id: 'pulses', en: 'Pulses / Dal', hi: 'दालें / चना', mr: 'डाळी / हरभरा' },
];

// Available languages in dropdown (Strictly English, Hindi, and Marathi)
export const AVAILABLE_LANGUAGES = [
  { code: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'en', label: 'English', flag: '🌐' },
];

// Storage helpers - Strictly stores only the farmer UUID in localStorage
export function getStoredFarmerId() {
  try {
    // If legacy farmer_profile exists, clean it up
    if (localStorage.getItem('farmer_profile')) {
      const legacy = localStorage.getItem('farmer_profile');
      try {
        const parsed = JSON.parse(legacy);
        if (parsed?.id && !localStorage.getItem('farmer_id')) {
          localStorage.setItem('farmer_id', parsed.id);
        }
      } catch (_) {}
      localStorage.removeItem('farmer_profile');
    }
    return localStorage.getItem('farmer_id') || null;
  } catch {
    return null;
  }
}

export function saveStoredFarmerId(id) {
  try {
    if (id) {
      localStorage.setItem('farmer_id', String(id));
    }
    // Ensure full profile is never saved to localStorage
    localStorage.removeItem('farmer_profile');
  } catch (e) {
    console.error('Failed to save farmer_id', e);
  }
}

export function clearStoredFarmerId() {
  try {
    localStorage.removeItem('farmer_id');
    localStorage.removeItem('farmer_profile');
  } catch (e) {
    console.error('Failed to clear stored farmer_id', e);
  }
}

// Deprecated aliases for backwards-compatibility that only deal with ID
export const getStoredProfile = () => null;
export const saveStoredProfile = (profile) => {
  if (profile?.id) saveStoredFarmerId(profile.id);
};
export const clearStoredProfile = clearStoredFarmerId;
