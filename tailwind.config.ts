import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0E1A22",
          900: "#132530",
          800: "#1B2F3B",
          700: "#25404F",
        },
        parchment: {
          50: "#FBF7ED",
          100: "#F3EAD1",
          200: "#E9DCB6",
        },
        moss: {
          400: "#5C9271",
          500: "#3F6B4F",
          600: "#2F5540",
        },
        amber: {
          300: "#F2C265",
          400: "#E8A33D",
          500: "#CE8626",
        },
        coral: {
          400: "#E06B72",
          500: "#D2555B",
          600: "#B23F45",
        },
        lagoon: {
          300: "#8FD3D6",
          400: "#4FAFB4",
          500: "#347F84",
        },
      },
      fontFamily: {
        display: [
          "Georgia",
          "Iowan Old Style",
          "Palatino Linotype",
          "URW Palladio L",
          "P052",
          "serif",
        ],
        body: [
          "ui-sans-serif",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        panel: "0 8px 30px rgba(9, 18, 24, 0.45)",
        card: "0 4px 14px rgba(9, 18, 24, 0.25)",
      },
      keyframes: {
        "float-up": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-40px)", opacity: "0" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "float-up": "float-up 1.1s ease-out forwards",
        "pop-in": "pop-in 0.25s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
