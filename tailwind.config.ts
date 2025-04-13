// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Enhanced color palette
        primary: {
          DEFAULT: "#7C4DFF",
          dark: "#5822FF",
          light: "#B599FF",
          // Additional shades for more depth
          50: "#F4F0FF",
          100: "#E6DDFF",
          200: "#CDBAFF",
          300: "#B599FF", // Same as primary-light
          400: "#9C77FF",
          500: "#7C4DFF", // Same as primary DEFAULT
          600: "#6A3FE6",
          700: "#5822FF", // Same as primary-dark
          800: "#4A1CCC",
          900: "#3A13A3",
        },
        background: {
          DEFAULT: "#0F0F14",
          lighter: "#1A1A24",
          card: "#24242E",
        },
        bg: {
          DEFAULT: "#0F0F14", // Align with background
          light: "#1A1A24",
        },
        txt: {
          DEFAULT: "#FFFFFF",
          secondary: "#B3B3B3",
          muted: "#8A8A9A",
        },
        accent: {
          blue: "#58ABFF",
          green: "#4DE6C8",
          yellow: "#FFC14D",
          pink: "#FF4DA6",
        },
        // Gradient stops for consistent gradients
        gradients: {
          primary: {
            start: "#7C4DFF",
            end: "#B599FF",
          },
          dark: {
            start: "#121218",
            end: "#252535",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        glow: "0 0 15px rgba(124, 77, 255, 0.5)",
        card: "0 10px 30px -5px rgba(0, 0, 0, 0.3)",
        "card-hover": "0 20px 40px -5px rgba(0, 0, 0, 0.4)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "card-shine":
          "linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.1) 30%, rgba(255, 255, 255, 0.1) 70%, transparent 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
