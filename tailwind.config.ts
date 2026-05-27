import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF6F2",
        blush: "#F3DDD9",
        rose: {
          DEFAULT: "#B14A6B",
          dark: "#8E3654",
          light: "#D98FA6",
        },
        gold: "#C39A4E",
        ink: "#2C2024",
        muted: "#6E5C61",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 12px 40px -12px rgba(142, 54, 84, 0.25)",
        card: "0 4px 24px -8px rgba(44, 32, 36, 0.18)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
