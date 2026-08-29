/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kraft: "#EFE8D8",
        paper: "#FBF9F2",
        ink: "#1B3A2F",
        "ink-muted": "#4B5B54",
        marigold: "#E0A83A",
        stamp: "#2B4E71",
        line: "#C7BCA0",
        primary: "#E0A83A",
        secondary: "#2B4E71",
        background: "#FBF9F2",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "dotted-leader": "linear-gradient(to right, var(--tw-gradient-stops))",
      },
      //NEW - Custom Container
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
          xl: "2.5rem",
          "2xl": "3rem",
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1536px",
        },
      },
      //NEW - Custom Screens
      screens: {
        "3xl": "1920px",
        "4xl": "2560px",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        charity: {
          primary: "#E0A83A",
          secondary: "#2B4E71",
          accent: "#E0A83A",
          neutral: "#1B3A2F",
          "base-100": "#FBF9F2",
          info: "#2B4E71",
          success: "#1B3A2F",
          warning: "#E0A83A",
          error: "#B0402C",
        },
      },
    ],
  },
};

module.exports = config;