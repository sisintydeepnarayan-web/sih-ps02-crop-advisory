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

// Profile storage helpers
export function getStoredProfile() {
  try {
    const data = localStorage.getItem('farmer_profile');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveStoredProfile(profile) {
  try {
    localStorage.setItem('farmer_profile', JSON.stringify(profile));
    if (profile?.id) {
      localStorage.setItem('farmer_id', profile.id);
    }
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function getStoredFarmerId() {
  try {
    return localStorage.getItem('farmer_id') || getStoredProfile()?.id || null;
  } catch {
    return null;
  }
}

export function clearStoredProfile() {
  try {
    localStorage.removeItem('farmer_profile');
    localStorage.removeItem('farmer_id');
  } catch (e) {
    console.error('Failed to clear stored profile', e);
  }
}
