/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          green: {
            50: '#f0fdf4',
            100: '#dcfce7',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
          },
          amber: {
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
          },
          red: {
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
          },
          soil: '#78350f',
        }
      },
      fontSize: {
        'touch': ['1.125rem', { lineHeight: '1.6' }],
        'touch-lg': ['1.25rem', { lineHeight: '1.75' }],
      }
    },
  },
  plugins: [],
}
