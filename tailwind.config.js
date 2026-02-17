/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        primary: "#CF2A2A",
        secondary: "#1E459F",
        accent: "#F3A712",
        background: "#E1DCCA",
        text: "#000000",
      },

      fontFamily: {
        brand: ["AlfaSlabOne"],
        fancy: ["Righteous"],
        sans: ["OutfitRegular"],
        button: ["OutfitBold"],
      },
    },
  },

  plugins: [],
};
