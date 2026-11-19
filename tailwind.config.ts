import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: { ivory: "#F5F1E9", forest: "#233A2C", rose: "#D8B4BC", gold: "#C4A477", ink: "#292C28" },
      fontFamily: { display: ['"Cormorant Garamond"', "Georgia", "serif"], sans: ["Manrope", "Arial", "sans-serif"] }
    }
  },
  plugins: []
} satisfies Config;
