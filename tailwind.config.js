/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4A6FA5",
          light: "#7B9FD4",
          dark: "#2D4A7A",
        },
        primaryLight: "#7B9FD4",
        primaryDark: "#2D4A7A",
        secondary: "#D4A373",
        surface: "#F8F9FA",
        surfaceDark: "#1E1E2E",
        textPrimary: "#1A1A2E",
        textSecondary: "#6B7280",
        border: "#E5E7EB",
        borderDark: "#2D2D3F",
        error: "#EF4444",
        success: "#22C55E",
        warning: "#F59E0B",
        highlight: {
          yellow: "#FEF3C7",
          green: "#D1FAE5",
          blue: "#DBEAFE",
          pink: "#FCE7F3",
        },
        darkBg: "#121220",
        darkCard: "#1A1A2E",
      },
    },
  },
  plugins: [],
};
