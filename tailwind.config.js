const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#fefae0",
        surface: "#faedcd",
        border: "#e8d5b7",
        "hover-bg": "#f5eed6",
        primary: "#d4a373",
        "primary-dark": "#b8895a",
        secondary: "#ccd5ae",
        heading: "#3d2b1f",
        body: "#5c4033",
        muted: "#9c8b7a",
        success: "#6b8f4a",
        warning: "#d4a343",
        error: "#c45c4a",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-space-grotesk)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-jetbrains-mono)", ...defaultTheme.fontFamily.mono],
      },
      boxShadow: {
        card: "0 1px 3px rgba(61,43,31,0.04), 0 4px 20px rgba(61,43,31,0.03)",
        "card-hover":
          "0 8px 30px rgba(212,163,115,0.12), 0 2px 8px rgba(61,43,31,0.04)",
        float: "0 20px 60px rgba(212,163,115,0.15)",
        "button-glow": "0 0 20px rgba(212,163,115,0.30)",
        nav: "0 1px 3px rgba(61,43,31,0.06)",
      },
      keyframes: {
        "float-orb": {
          "0%": { transform: "translate(0%, 0%) scale(1)" },
          "33%": { transform: "translate(5%, -8%) scale(1.05)" },
          "66%": { transform: "translate(-3%, 4%) scale(0.95)" },
          "100%": { transform: "translate(0%, 0%) scale(1)" },
        },
        "float-orb-reverse": {
          "0%": { transform: "translate(0%, 0%) scale(1)" },
          "33%": { transform: "translate(-6%, 5%) scale(0.95)" },
          "66%": { transform: "translate(4%, -6%) scale(1.05)" },
          "100%": { transform: "translate(0%, 0%) scale(1)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        marquee: {
          from: { transform: "translateX(0%)" },
          to: { transform: "translateX(calc(-50% - 1rem))" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        aurora: {
          "0%": { backgroundPosition: "50% 50%, 50% 50%" },
          "100%": { backgroundPosition: "350% 50%, 350% 50%" },
        },
      },
      animation: {
        "float-orb": "float-orb 25s ease-in-out infinite",
        "float-orb-reverse": "float-orb-reverse 30s ease-in-out infinite",
        "slide-up": "slide-up 0.6s ease-out both",
        "fade-in": "fade-in 0.5s ease-out both",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        marquee: "marquee var(--duration, 20s) linear infinite",
        float: "float 8s ease-in-out infinite",
        aurora: "aurora 60s linear infinite",
      },
    },
  },
  plugins: [addVariablesForColors],
};

function addVariablesForColors({ addBase, theme }) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
