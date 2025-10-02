
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2563eb',
          dark: '#1e40af',
          light: '#60a5fa'
        }
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(0,0,0,0.06)',
      }
    },
  },
  plugins: [],
}
