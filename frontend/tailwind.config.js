/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        premium: {
          light: "#F5F5F7",
          dark: "#1D1D1F",
          accent: "#0071E3",
        }
      }
    },
  },
  plugins: [],
}
