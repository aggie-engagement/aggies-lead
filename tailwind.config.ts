import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        aggie: {
          navy: "#031322",
          blue: "#0b2942",
          steel: "#5f8eaa",
          silver: "#c8d2dc",
          chrome: "#f7fbff",
          ice: "#eef7ff",
          light: "#eaf2f8",
          muted: "#8ea7bb",
        },
      },
      boxShadow: {
        glow: "0 0 42px rgba(238, 247, 255, 0.18)",
        steel: "0 0 36px rgba(95, 142, 170, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
