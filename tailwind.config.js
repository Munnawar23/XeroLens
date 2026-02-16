/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        // 🎞️ Brand Colors (Semantic)
        brand: {
          primary: "#E64624", // main brand color
          accent: "#9A0500", // buttons / highlights
          soft: "#FFAF58", // secondary highlight
          highlight: "#19481E", // success / special states
        },

        // ⭐ UI System
        ui: {
          background: "#FFF4E0",
          surface: "#FFFFFF",
          border: "#F1DFC5",
          text: "#3A2A22",
          muted: "#7A685D",
        },
      },

      fontFamily: {
        brand: ["SpaceGrotesk-SemiBold", "SpaceGrotesk-Bold"],
        serif: ["PlayfairDisplay-Regular", "PlayfairDisplay-Italic"],
      },
    },
  },

  plugins: [],
};
