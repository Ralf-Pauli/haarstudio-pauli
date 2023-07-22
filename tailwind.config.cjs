/** @type {import('tailwindcss').Config}*/
const config = {
  darkMode: 'class',
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      colors: {
        primary: "#d19555",
      },
      minWidth: {
        "1/4": "25%",
      },
    },
  },
  plugins: [],
};

module.exports = config;
