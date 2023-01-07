/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  corePlugins: {
    preflight: false,
  },
  prefix: 'tw-',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'faded-black': 'rgba(0, 0, 0, 0.6)',
        'pink': '#F8ACFF',
        'purple': '#5F00FA',
        'gradient-finish': '#C808D9',
      },
    },
  },
  plugins: [],
  important: true,
};
