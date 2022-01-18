module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        's1/4': '25vw',
        's1/2': '50vw',
      },
      height: {
        's1/4': '25vh',
        lg: '28rem',
      },
      maxWidth: {
        24: '6rem',
      },
      animation: {
        'text-in': 'enter-in 2s 1s cubic-bezier(0.5, 0, 0.1, 1) both',
      },
      keyframes: {
        'enter-in': {
          from: {
            'clip-path': 'circle(0%)',
          },
          to: {
            'clip-path': 'circle(100%)',
          },
        },
      },
      transistionProperty: {
        height: 'height',
      },
      translate: {
        sx: '-100vw',
        '1/2s': '50vw',
      },
    },
    fontFamily: {
      body: ['futura-book'],
      main: ['futura-extra-bold'],
      condensed: ['futura-condensed'],
    },
  },
  variants: {
    extend: {
      display: ['focus, group-focus'],
      width: ['hover'],
    },
  },
  plugins: [],
  corePlugins: {
    translate: true,
  },
};
