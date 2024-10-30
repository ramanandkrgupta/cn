/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  theme: {
    extend: {
      fontFamily: {
        epilogue: ["Epilogue", "sans-serif"],
      },
      colors: {},
      screens: {
        xs: "400px",
      },
      boxShadow: {
        secondary: "10px 10px 20px rgba(2, 2, 2, 0.25)",
      },
      translate: ["group-hover", "group-focus"],
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
     darkTheme: "mydark",
    themes: [
      {
        mydark: {

          "primary": "#f97316",

          "secondary": "#f5f5f4",

          "accent": "#4ade80",

          "neutral": "#1f2937",

          "base-100": "#13131a",

          "info": "#0087f2",

          "success": "#56e900",

          "warning": "#fecaca",

          "error": "#b91c1c",
          
        },
      },
      {
        mylight: {
          
"primary": "#f97316",
          
"secondary": "#1c1917",
          
"accent": "#4ade80",
          
"neutral": "#1f2937",
          
"base-100": "#f5f5f4",
          
"info": "#0087f2",
          
"success": "#56e900",
          
"warning": "#fecaca",
          
"error": "#b91c1c",
          },
        },
    ],
    // themeRoot: ":root",
  }
};
