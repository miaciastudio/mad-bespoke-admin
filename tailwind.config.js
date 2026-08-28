/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#FFFFFF',
          card: '#FFFFFF',
          sidebar: '#1E1B4B',
          subtle: '#E2E8F0',
        },
        burgundy: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          700: '#9F1239',
          800: '#881337',
          900: '#4C0519',
        },
        gold: {
          100: '#FEF3C7',
          300: '#FCD34D',
          500: '#F59E0B',
          600: '#D97706',
        },
      },
      fontFamily: {
        serif: ['"Fredoka"', 'cursive', 'sans-serif'],
        display: ['"Fredoka"', 'cursive', 'sans-serif'],
        sans: ['"Fredoka"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
