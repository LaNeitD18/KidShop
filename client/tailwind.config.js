module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        xs: "576px",
      },
      fontFamily: {
        logo: [
          "Fredoka One",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      spacing: {
        "nav-height": "56px",
        "sider-width": "256px",
        128: "32rem",
      },
      colors: {
        normal: "#F6F8FA",
        primary: "#2DA44E",
      },
      boxShadow: {
        "lg-soft":
          "0 10px 15px -3px rgba(0, 0, 0, 0.075), 0 4px 6px -2px rgba(0, 0, 0, 0.0375)",
        "2xl-soft": "0 25px 50px -12px rgba(0, 0, 0, 0.1875)",
      },
      backgroundImage: {
        kidshop: "url('https://iili.io/5jFy42.jpg')",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
