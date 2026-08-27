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
          DEFAULT: '#F4ECE4',
          card: '#FFFFFF',
          sidebar: '#2C1810',
          subtle: '#E8DDD3',
        },
        burgundy: {
          50: '#FBF3F4',
          100: '#F5E4E6',
          700: '#722F37',
          800: '#5A232A',
          900: '#3D151B',
        },
        gold: {
          100: '#F7EEDF',
          300: '#DFC89F',
          500: '#B8944F',
          600: '#9E7C3C',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
