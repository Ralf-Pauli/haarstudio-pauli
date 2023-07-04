/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      colors: {
        primary: "#bf8d30",
      }
    },
  },
  plugins: [],
};

module.exports = config;
