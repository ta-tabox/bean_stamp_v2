/* @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        noto: ['Noto Sans JP'],
        notoserif: ['Noto Serif'],
      },
      // prettier-ignore
      maxHeight: {
        '128': '32rem',
      },
      // prettier-ignore
      width: {
        '128': '32rem',
        '144': '36rem',
        '160': '40rem'
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active', 'checked'],
      textColor: ['active', 'checked'],
      opacity: ['disabled'],
      cursor: ['disabled'],
      borderWidth: ['hover', 'focus'],
    },
  },
  plugins: [],
}
