/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        display: ['"Instrument Serif"', 'serif'],
      },
      colors: {
        bg: "#FFFFFF",
        surface: "#F8FAFC",
        "text-primary": "#0F172A",
        muted: "#475569",
        stroke: "#E2E8F0",
        accent: "#0D5EAF", // Azul Grécia
        light: "#DBEAFE"
      },
      keyframes: {
        "scroll-down": {
          "0%, 100%": { transform: "translateY(-25%)", opacity: "0" },
          "50%": { opacity: "1" },
          "75%": { transform: "translateY(25%)", opacity: "0" }
        }
      },
      animation: {
        "scroll-down": "scroll-down 2s cubic-bezier(0.4, 0, 0.2, 1) infinite"
      }
    },
  },
  plugins: [],
};
