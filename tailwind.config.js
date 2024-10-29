/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
          'genoa': {
          '50': '#edfffc',
          '100': '#c2fff6',
          '200': '#84ffef',
          '300': '#3fffe5',
          '400': '#08f9d6',
          '500': '#00dcbe',
          '600': '#00b29e',
          '700': '#008d7e',
          '800': '#006b62',
          '900': '#065b53',
          '950': '#003836',
        }, 
        'white': '#fff',
        'button': {
          'active': '#006b62',
          'inactive': '#999'
        },
        'info': '#fed300',
        'info-second': '#fed30080',
        'error': 'cb0100'
      },
      screens: {
        print: { raw: 'print' },
        screen: { raw: 'screen' },
      },

    },
  },
  plugins: [],
}
