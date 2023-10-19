/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors:{
      // These are all light mode
      "primary": "#0FD5BA",
      "secondary": "#3DA9FC",
      "tertiary": "#084778",
      "text": "#084778"
    },
    fontFamily: {
      "hind": ["Hind", "sans-serif"],
    },
    extend: {
    },
  },
  plugins: [],
}

