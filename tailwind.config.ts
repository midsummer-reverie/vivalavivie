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
        brand: {
          dark: "#0f0c29",
          purple: "#302b63",
          accent: "#c084fc",
          glow: "#a855f7",
          iosBlue: "#007AFF", 
        },
      },
      fontFamily: {
        // บังคับใช้ Google Sans ตัวเดียวรวด
        sans: ['"Google Sans"', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        }
      },
      animation: {
        'float-fast': 'float 3s ease-in-out infinite',
        'float-normal': 'float 4s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;