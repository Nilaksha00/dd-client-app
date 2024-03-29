import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          "50": "#eff6ff",
          "100": "#dbeafe",
          "200": "#bfdbfe",
          "300": "#93c5fd",
          "400": "#60a5fa",
          "500": "#3b82f6",
          "600": "#2563eb",
          "700": "#1d4ed8",
          "800": "#1e40af",
          "900": "#1e3a8a",
          "950": "#172554",
        },
        secondary: {
          "50": "#fdf2f2",
          "100": "#fde2e2",
          "200": "#fbb6b6",
          "300": "#f88787",
          "400": "#f45b5b",
          "500": "#ee3535",
          "600": "#d92424",
          "700": "#b91a1a",
          "800": "#931111",
          "900": "#6e0c0c",
          "950": "#4e0808",
        },
        tertiary: {
          "50": "#f0f9eb",
          "100": "#d4f0c5",
          "200": "#a9e88b",
          "300": "#7dcd58",
          "400": "#4fa027",
          "500": "#2d7d2f",
          "600": "#265b24",
          "700": "#1e3d1b",
          "800": "#142616",
          "900": "#0a0f0b",
          "950": "#000000",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
