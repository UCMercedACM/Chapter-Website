/** @type {import('tailwindcss').Config} */
const { nextui } = require('@nextui-org/react')
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      hind: ['Hind', 'sans-serif'],
      montserrat: ['Montserrat', 'sans-serif'],
      bebas: ['Bebas Neue', 'sans-serif'],
    },
    extend: {
      colors: {
        // These are all light mode
        primary: '#0FD5BA',
        secondary: '#3DA9FC',
        tertiary: '#084778',
        text: '#084778',
        'primary-background': '#f5f5f5',
        landing: '#00e1bf',
        'landing-secondary': '#00e1bfcc',
      },
      minHeight: {
        40: '40%',
      },
      spacing: {
        neg4: '-4%',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        'blue-dark': {
          extend: 'dark',
          colors: {
            foreground: '#ECEFEF',
            background: '#2C2828',
            primary: {
              100: '#E8F8FF',
              200: '#D1F0FF',
              300: '#BAE5FF',
              400: '#A8DAFF',
              500: '#8CC8FF',
              600: '#669DDB',
              700: '#4675B7',
              800: '#2C5293',
              900: '#1A387A',
              DEFAULT: '#8CC8FF',
            },
          },
        },
      },
    }),
  ],
}
