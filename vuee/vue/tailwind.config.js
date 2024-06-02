/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // "./index.html",
    './public/**/*.html',
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      colors: {
        'regal-blue': '#243c5a',
      },

    },
  },
  plugins: [],
}