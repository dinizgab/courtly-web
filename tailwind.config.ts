import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#0a0a0a",

        card: {
          DEFAULT: "#ffffff",
          foreground: "#0a0a0a",
        },

        popover: {
          DEFAULT: "#ffffff",
          foreground: "#0a0a0a",
        },

        primary: {
          DEFAULT: "#52b788",
          hiper_light: "#eff8f3",
          light: "#c4e9d6",
          heavy: "#2d6a4f",
          foreground: "#fcfcfc",
        },

        secondary: {
          DEFAULT: "#f5f5f5",
          foreground: "#171717",
        },

        muted: {
          DEFAULT: "#f5f5f5",
          foreground: "#737373",
        },

        accent: {
          DEFAULT: "#f5f5f5",
          foreground: "#171717",
        },

        destructive: {
          DEFAULT: "#df4f4f",
          foreground: "#fcfcfc",
        },

        border: "#e6e6e6",
        input: "#e6e6e6",
        ring: "#0a0a0a",

        chart: {
          "1": "#e07b39",
          "2": "#34a582",
          "3": "#2d5568",
          "4": "#f4c24d",
          "5": "#f08c4e",
        },

        sidebar: {
          DEFAULT: "#fcfcfc",
          foreground: "#42464b",
          primary: "#1a1a1c",
          "primary-foreground": "#fcfcfc",
          accent: "#f4f4f5",
          "accent-foreground": "#1a1a1c",
          border: "#e7e9ed",
          ring: "#5591e0",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
