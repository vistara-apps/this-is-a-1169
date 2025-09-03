/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: 'hsl(220 50% 40%)',
          50: 'hsl(220 50% 95%)',
          100: 'hsl(220 50% 90%)',
          200: 'hsl(220 50% 80%)',
          300: 'hsl(220 50% 70%)',
          400: 'hsl(220 50% 60%)',
          500: 'hsl(220 50% 50%)',
          600: 'hsl(220 50% 40%)',
          700: 'hsl(220 50% 30%)',
          800: 'hsl(220 50% 20%)',
          900: 'hsl(220 50% 10%)',
        },
        accent: {
          DEFAULT: 'hsl(180 60% 50%)',
          50: 'hsl(180 60% 95%)',
          100: 'hsl(180 60% 90%)',
          200: 'hsl(180 60% 80%)',
          300: 'hsl(180 60% 70%)',
          400: 'hsl(180 60% 60%)',
          500: 'hsl(180 60% 50%)',
          600: 'hsl(180 60% 40%)',
          700: 'hsl(180 60% 30%)',
          800: 'hsl(180 60% 20%)',
          900: 'hsl(180 60% 10%)',
        },
        bg: 'hsl(220 15% 10%)',
        surface: 'hsl(220 15% 15%)',
        text: 'hsl(220 10% 90%)',
        'text-secondary': 'hsl(220 10% 60%)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(0, 0%, 0%, 0.1)',
        'modal': '0 16px 48px hsla(0, 0%, 0%, 0.16)',
      },
      animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}