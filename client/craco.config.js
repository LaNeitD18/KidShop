const CracoLessPlugin = require('craco-less');

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
              '@layout-body-background': '#FFFFFF',
              '@layout-header-background': '#282A3A',
              '@text-color': '#24292f',
              '@background-color-light': '#F9FAFB',
              '@background-color-base': '#F3F4F6',
              '@layout-header-padding': '0 32px',
              '@border-color-base': '#D1D5DB',
              '@border-color-split': '#E5E7EB',
              '@border-radius-base': '4px',
              '@padding-lg': '26px',
              '@padding-md': '18px',
              '@padding-sm': '14px',
              '@padding-xs': '10px',
              '@padding-xss': '6px',
              '@height-base': '36px',
              '@height-lg': '44px',
              '@height-sm': '26px',
              '@font-size-base': '16px',
              '@font-size-lg': '16px',
              '@font-size-sm': '14px',
              '@line-height-base': '1.643',
              '@btn-padding-horizontal-base': '16px',
              '@btn-padding-horizontal-sm': '8px',
              '@menu-item-padding-horizontal': '16px',
              '@menu-inline-toplevel-item-height': '48px',
              '@checkbox-size': '18px',
              '@table-header-bg': '#ffffff',
              '@checkbox-border-width': '2px',
              '@tag-line-height': '22px',
              '@typography-title-margin-bottom': '0',
              '@dropdown-vertical-padding': '7px',
              '@dropdown-line-height': '24px',
              '@select-dropdown-height': '34px',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
