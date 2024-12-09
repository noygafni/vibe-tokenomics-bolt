/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'sage': {
          50: '#f4f6f4',
          100: '#e7ebe7',
          200: '#d3dcd3',
          300: '#b4c2b4',
          400: '#95a795',
          500: '#788c78',
          600: '#5f715f',
          700: '#4d5b4d',
          800: '#414b41',
          900: '#383f38',
        },
        'cream': {
          50: '#fdfbf7',
          100: '#faf6ed',
          200: '#f3eada',
          300: '#e9d8bc',
          400: '#dfc199',
          500: '#d4a877',
          600: '#c28c5b',
          700: '#a2714a',
          800: '#835c40',
          900: '#6b4c37',
        },
        'coral': {
          50: '#fff4f0',
          100: '#ffe8e0',
          200: '#ffd0c0',
          300: '#ffb199',
          400: '#ff8566',
          500: '#ff5533',
          600: '#ff2b0a',
          700: '#cc1700',
          800: '#a61400',
          900: '#881100',
        },
        'mint': {
          50: '#f2f9f9',
          100: '#e6f3f3',
          200: '#bfe2e2',
          300: '#99d1d1',
          400: '#4dafaf',
          500: '#008c8c',
          600: '#007e7e',
          700: '#006969',
          800: '#005454',
          900: '#004545',
        },
        'sand': {
          50: '#fcf9f6',
          100: '#f9f3ed',
          200: '#f0e2d1',
          300: '#e7d1b5',
          400: '#d4ae7e',
          500: '#c28b47',
          600: '#af7d40',
          700: '#926835',
          800: '#74532b',
          900: '#5f4423',
        }
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontFamily: {
        'display': ['Clash Display', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
};