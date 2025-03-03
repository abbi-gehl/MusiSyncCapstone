/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        accentBlue: "#ADE1EF", // light blue accent
        accentPeach: "#FFC196", // peach accent color
        background: "#CF9B9B", // salmon background
        lightText: "#ffffff", // white text
        darkText: "#000000",  // dark text
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};