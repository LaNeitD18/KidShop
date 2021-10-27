const CracoLessPlugin = require('craco-less')

module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#1DA57A',
              '@success-color': '#22C55E',
              '@processing-color': '#3B82F6',
              '@error-color': '#EF4444',
              '@highlight-color': '#EF4444',
              '@warning-color': '#FBBF24',
              '@normal-color': '#F6F8FA',
              '@text-selection-bg': '#60A5FA',
              '@layout-body-background': '#F6F8FA',
              '@layout-header-background': '#1F2937',
              '@text-color': '#24292f',
              '@layout-header-padding': '0 32px',
              '@border-color-base': '#D0D7DE',
              '@border-radius-base': '4px',
              '@menu-item-padding-horizontal': '16px',
              '@padding-lg': '26px',
              '@padding-md': '18px',
              '@padding-sm': '14px',
              '@padding-xs': '10px',
              '@padding-xss': '6px',
              '@height-base': '36px',
              '@height-lg': '44px',
              '@height-sm': '26px',
              '@font-size-base': '16px',
              '@font-size-sm': '14px',
              '@line-height-base': '1.643',
              '@btn-padding-horizontal-base': '16px',
              '@btn-padding-horizontal-sm': '8px',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
}
