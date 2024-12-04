/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
    theme: {
      extend: {
        colors: {
          hover: {
            DEFAULT: '#a855f7r',
            focus: {
              DEFAULT: '#a855f7',
            },
          },
        },
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          lg: '1124px',
          xl: '1124px',
          '2xl': '1124px',
        },
      },
    },
    plugins: [require('flowbite/plugin'), require('tailwind-scrollbar')],
  };