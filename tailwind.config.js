/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  darkMode: ["class"],
  content: [
    './pages/*.{ts,tsx}',
    './src/components/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './src/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        'custom': ['Ubuntu', 'sans-serif'],
      },
      transitionProperty: {
        'max-height': 'max-height'
      },
      boxShadow: {
        '3xl': '0px 2px 12px 0px rgba(0, 0, 0, 0.15)'
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: '#006AF9',
          hover: '#0162E5',
          focus: '#005DDB',
          pressed: '#0059D1',
          light: '#E6F0FE',
          'very-light': '#F2F7FF',
          soft: '#8ABAFC',
          dark: '#004BB1',
          50: '#F5F9FF',
        },
        'secondary-gray': {
          10: '#F8F8F9',
          50: '#FAFAFB',
          100: '#EBEBEB',
          200: '#E0E0E0',
          300: '#D6D6D6',
          350: '#D9D9D9',
          400: '#9A9A9A',
          500: '#666666',
          600: '#343434'
        },
        'red': {
          DEFAULT: '#EA4335',
          dark: '#A50E0E',
        },
        'green': {
          DEFAULT: '#0D652D',
        },
        'pink': {
          DEFAULT: '#FF10F0',
          light: '#FFE5FD',
        },
        notification: {
          green: '#CEEAD6',
          red: '#FAD2CF',
          yellow: '#FEEFC3',
          DEFAULT: '#E37400',
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "shimmer": {
          "100%": {
            "transform": "translateY(100%)",
          },
        },
        "load": {
            "0%": {
                transform: "rotate(0deg)"
            },
            "100%": {
                transform: "rotate(360deg)"
            }
        },
        "fadeIn": {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        "slow-ping": "ping 5s linear infinite",
        "slow-spin": "spin 1s linear infinite",
        fadeIn: 'fadeIn 1s ease-in-out',
      },
    },
    fill: theme => theme('colors'),
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography'),require('tailwind-scrollbar')],

})
