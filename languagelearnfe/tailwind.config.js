/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ink: "#152238",
        cue: "#FFF6E8",
        stamp: "#B42318",
        moss: "#1F5C4E",
        paper: "#F7F4EE",
      },
      fontFamily: {
        literata: ["Literata", "Georgia", "serif"],
        figtree: ["Figtree", "system-ui", "sans-serif"],
        plex: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
