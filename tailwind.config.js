/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#137fec',
        'background-light': '#f6f7f8',
        'background-dark': '#101922',
        'glass-border': 'rgba(255, 255, 255, 0.08)',
        'glass-bg': 'rgba(35, 54, 72, 0.4)',
        'glass-highlight': 'rgba(255, 255, 255, 0.03)'
      },
      fontFamily: {
        display: ['Space Grotesk', 'Noto Sans', 'sans-serif'],
        body: ['Noto Sans', 'sans-serif']
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        full: '9999px'
      },
      backdropBlur: {
        xs: '2px'
      }
    }
  },
  plugins: [],
}
