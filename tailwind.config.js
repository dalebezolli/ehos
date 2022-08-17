/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      'primary': '#9E5277',
      'light': '#FFFFFF',
      'light-secondary': '#A7A7A7',
      'dark': '#111111',
      'dark-secondary': '#242426',
      'input-focus': '#363636',
      // ! TEMPORARY, For conversion between colors
      ...colors,
    },
    extend: {
      fontFamily: {
        'sans': ['Inter', ...defaultTheme.fontFamily.sans]
      },
      fontSize: {
        tiny: '0.5rem',
      }
    },
  },
  plugins: [],
}
