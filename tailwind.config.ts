import { type Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg_primary: "#120D31",
        secondary: "#211E3F",
        primary: "#4A41AA",
        accent: "#B6AFFF",
        inactive: "#D8D8D8",
        btn_secondary: "#302F4D",
      },
    },
  },
  plugins: [],
} satisfies Config;
