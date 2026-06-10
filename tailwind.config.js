/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#18201f',
        mist: '#f7faf8',
        leaf: '#0f766e',
        moss: '#5c7c2f',
        sun: '#d97706',
        sky: '#2563eb',
        berry: '#be185d',
        clay: '#b45309'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(20, 32, 31, 0.08)'
      }
    }
  },
  plugins: []
};
