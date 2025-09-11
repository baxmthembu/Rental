/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sa-green': '#007A4D',
        'sa-gold': '#FFB612',
        'sa-blue': '#002395',
      },
    },
  },
  plugins: [],
}