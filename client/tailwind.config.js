/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        "color-grey-dark": "#c9c9c9",
        "color-grey-light": "#c9c9c9",
        "color-dark": "#1C1C1E",
        "color-darker": "#1a1a1b",
        "color-blue": "#2568ef",
        "border-grey-dark": "#3a3939",
        "border-dark": "#222222",
        "color-filter": "#282829",
        "dark-lighten": "#333335",
      },
      screens: {
        "min-w-937": "937px",
      },
    },
  },
  plugins: [],
};
