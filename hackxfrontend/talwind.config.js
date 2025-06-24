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
          nortune: ['"NortuneBlack"', '"Inter"', 'sans-serif'],
          sans: ['"Inter"', 'sans-serif']
        }      
      },
    },
  };
  