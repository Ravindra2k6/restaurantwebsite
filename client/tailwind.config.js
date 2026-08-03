/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Premium luxury palette: deep charcoal + warm gold accent, evocative
        // of upscale Indian dining without leaning on cliché red/orange.
        primary: {
          50: "#fdf8f0",
          100: "#f9ecd7",
          200: "#f2d7a8",
          300: "#e9bd72",
          400: "#dfa348",
          500: "#c98a2e", // core gold
          600: "#a86d23",
          700: "#87531f",
          800: "#6d431f",
          900: "#5a381c",
        },
        charcoal: {
          50: "#f6f6f7",
          100: "#e2e2e4",
          200: "#c4c4c8",
          300: "#9d9da3",
          400: "#75757d",
          500: "#535359",
          600: "#3a3a3f",
          700: "#28282c",
          800: "#1a1a1d",
          900: "#0f0f11",
          950: "#08080a",
        },
        cream: "#fffaf0",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #dfa348 0%, #c98a2e 50%, #a86d23 100%)",
        "hero-overlay": "linear-gradient(180deg, rgba(8,8,10,0.3) 0%, rgba(8,8,10,0.75) 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.25)",
        gold: "0 8px 24px -6px rgba(201, 138, 46, 0.45)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "spin-slow": "spin 3s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
