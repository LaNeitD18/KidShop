module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        xs: '576px',
      },
      fontFamily: {
        logo: [
          'Fredoka One',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
      },
      spacing: {
        'nav-height': '64px',
        'sider-width': '256px',
        128: '32rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};