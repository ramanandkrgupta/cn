/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {

      transitionTimingFunction: {
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      fontFamily: {
        epilogue: ['Epilogue', 'sans-serif'],
      },

      boxShadow: {
        myShadow1: '4.1px -5px 0 0 rgb(17,24,39)',
        myShadow2: '-4.1px -5px 0 0 rgb(17,24,39)',
      },

      colors: {},
      screens: {
        xs: '400px',
      },
      boxShadow: {
        secondary: '10px 10px 20px rgba(2, 2, 2, 0.25)',
      },
      translate: ['group-hover', 'group-focus'],
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        press: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
        },
        'fade-theme': {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '0' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        press: 'press 200ms ease-in-out',
        'fade-theme': 'fade-theme 300ms ease-out forwards'
      }
    },
  },
  plugins: [
    require('daisyui'),
    require('tailwind-scrollbar'),
  ],
  daisyui: {
    darkTheme: 'mydark',
    themes: [
      {
        mydark: {
          primary: '#f97316',  //#f97316 orange  #0EA5E9 blue
          
          'base-300': '#1c1c24',

          secondary: '#f5f5f4',

          accent: '#4ade80',

          neutral: '#1f2937',

          'base-100': '#13131a',

          info: '#0087f2',

          success: '#56e900',

          warning: '#fecaca',

          error: '#b91c1c',
        },
      },
      {
        mylight: {
          primary: '#f97316',
          'base-300': '#eaeaea',
          secondary: '#1c1917',
          accent: '#4ade80',
          neutral: '#1f2937',
          'base-100': '#f5f5f4',
          info: '#0087f2',
          success: '#56e900',
          warning: '#fecaca',
          error: '#b91c1c',
        },
      },
    ],
    // themeRoot: ":root",
  },
}
