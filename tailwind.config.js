/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      keyframes: {
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        spin: 'spin 1s linear infinite',
      },
      colors: {
        // App.js Conf colors
        appBlue: {
          100: '#484dfc', // --primary-blue--100
          80: '#7189ff', // --primary-blue--80
          60: '#a0b9ff', // --primary-blue--60
          40: '#ccd8ff', // --primary-blue--40
          20: '#eef0ff', // --primary-blue--20
        },
        appBlack: {
          100: '#261930', // --black--100
          80: '#50415b', // --black--80
          60: '#877b91', // --black--60
          40: '#cac3d1', // --black--40
          20: '#e6e2ed', // --black--20
        },
        appAccent: {
          120: '#ff5a5a', // --accent-color--120
          100: '#f8d9d6', // --accent-color--100
          50: '#f7eded', // --accent-color--50
          0: '#faf8f8', // --accent-color--0
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
  ],
  corePlugin: {
    textOpacity: true,
  },
};
