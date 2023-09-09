/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    content: ['./src/**/*.svelte', './public/index.html'],
    options: {
      safelist: [],
    }
  },
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}

