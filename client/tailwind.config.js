/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F4F5F7",
        surface: "#FFFFFF",
        accent: "#FF6B35",
        "accent-soft": "#E85A2A",
        slate: "#1F2937",
        "text-primary": "#1F2937",
        "text-muted": "#6B7280",
        border: "#E5E7EB",
      },
      fontFamily: {
        heading: ["Archivo", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};