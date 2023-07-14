/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  prefix: "tw-",
  theme: {
    breakpoints: {
      xs: { max: "599.98px" },
      sm: { min: "600px", max: "959.98px" },
      md: { min: "960px", max: "1279.98px" },
      lg: { min: "1280px", max: "1919.98px" },
      xl: { min: "1920px" },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
      },
    },
  },
  plugins: [],
};
