/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf8f0",
          100: "#f9ecd7",
          200: "#f2d7a8",
          300: "#e9bd72",
          400: "#dfa348",
          500: "#c98a2e",
          600: "#a86d23",
          700: "#87531f",
          800: "#6d431f",
          900: "#5a381c",
        },
        surface: {
          light: "#ffffff",
          dark: "#151518",
        },
        sidebar: {
          DEFAULT: "#111113",
          hover: "#1d1d20",
        },
      },
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)",
        glass: "0 8px 32px 0 rgba(0,0,0,0.2)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideIn: {
          "0%": { opacity: 0, transform: "translateX(-8px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
