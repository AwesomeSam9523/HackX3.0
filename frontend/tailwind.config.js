/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Essential for next-themes
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
      },
      fontFamily: {
        nortune: ['"NortuneBlack"', '"Inter"', "sans-serif"],
        sans: ['"Inter"', "sans-serif"],
        avgardn: ["'Avgardn'", "sans-serif"],
        avgardd: ["'Avgardd'", "sans-serif"],
        avgarddo: ["'Avgarddo'", "sans-serif"],
        kinetikaLight: ["'KinetikaLight'", "sans-serif"],
        kinetikaUltra: ["'KinetikaUltra'", "sans-serif"],
      },
    },
  },
};
