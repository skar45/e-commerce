module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        's1/4': '25vw',
      },
      height: {
        's1/4': '25vh',
      },
      animation: {
        slide: 'underline 2s 4s forwards',
        shutter: 'open 1s forwards',
      },
      keyframes: {
        underline: {
          '100%': { 'border-bottom': '2px solid red' },
        },
        open: {
          '0%': { transform: 'translate(0%,-100%)' },
          '100%': { transform: 'translate(0%,0%)' },
        },
      },
      transistionProperty: {
        height: 'height',
      },
      translate: {
        sx: '-100vw',
      },
    },
  },
  variants: {
    extend: {
      display: ['focus, group-focus'],
    },
  },
  plugins: [],
  corePlugins: {
    translate: true,
  },
};
