/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app.vue",
    "./pages/**/*.vue",
    "./components/**/*.vue"
  ],
  theme: {
    extend: {
      colors: {
        valorantRed: "#ff4655",
        valorantDark: "#0f1923",
        valorantGray: "#1a2732"
      }
    },
  },
  plugins: [],
}
