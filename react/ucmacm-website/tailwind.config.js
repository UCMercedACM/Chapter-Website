/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      // These are all light mode
      primary: "#0FD5BA",
      secondary: "#3DA9FC",
      tertiary: "#084778",
      text: "#084778",
      "primary-background": "#f5f5f5",
      "landing-background": "#00e1bf",
    },
    fontFamily: {
      hind: ["Hind", "sans-serif"],
    },
    extend: {
      minHeight: {
        40: "40%",
      },
      spacing: {
        neg4: "-4%",
      },
    },
  },
  plugins: [],
};
