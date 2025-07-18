/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#f7f3f0',
          100: '#e8ddd4',
          200: '#d4c2a8',
          300: '#bc9a7a',
          400: '#a67c52',
          500: '#8b5a2b',
          600: '#6f4518',
          700: '#523010',
          800: '#3a1f0a',
          900: '#1f0f04',
        }
      }
    },
  },
  plugins: [],
} 