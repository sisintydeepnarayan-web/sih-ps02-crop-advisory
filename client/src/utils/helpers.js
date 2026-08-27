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
  'Uttar Pradesh': ['Lucknow', 'Varanasi', 'Gorakhpur', 'Meerut', 'Agra', 'Kanpur'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Ujjain', 'Jabalpur', 'Sehore', 'Vidisha'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Patiala', 'Bathinda', 'Jalandhar', 'Sangrur'],
  'Haryana': ['Karnal', 'Hisar', 'Ambala', 'Rohtak', 'Kurukshetra', 'Sirsa'],
  'Maharashtra': ['Nashik', 'Pune', 'Nagpur', 'Aurangabad', 'Solapur', 'Kolhapur'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Sri Ganganagar', 'Alwar', 'Bikaner'],
  'Bihar': ['Patna', 'Muzaffarpur', 'Gaya', 'Bhagalpur', 'Darbhanga', 'Samastipur'],
};

// Major crops list
export const MAJOR_CROPS = [
  { id: 'wheat', en: 'Wheat', hi: 'गेहूँ' },
  { id: 'rice', en: 'Paddy / Rice', hi: 'धान / चावल' },
  { id: 'mustard', en: 'Mustard', hi: 'सरसों' },
  { id: 'cotton', en: 'Cotton', hi: 'कपास' },
  { id: 'maize', en: 'Maize / Corn', hi: 'मक्का' },
  { id: 'sugarcane', en: 'Sugarcane', hi: 'गन्ना' },
  { id: 'potato', en: 'Potato', hi: 'आलू' },
  { id: 'soybean', en: 'Soybean', hi: 'सोयाबीन' },
  { id: 'pulses', en: 'Pulses / Dal', hi: 'दालें / चना' },
];

// Profile storage helper
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
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}
