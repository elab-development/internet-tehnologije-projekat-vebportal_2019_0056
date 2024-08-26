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
    },
    plugins: [require('flowbite/plugin')],
  };