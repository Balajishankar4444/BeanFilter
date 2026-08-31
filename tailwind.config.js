/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#fdfbf7',
          100: '#f7f2e8',
          200: '#eee0cb',
          300: '#e1c6a2',
          400: '#d1a575',
          500: '#c28850',
          600: '#a96d40',
          700: '#875235',
          800: '#714432',
          900: '#5c382b',
          950: '#341d17',
        },
        espresso: {
          900: '#171210',
          950: '#0f0c0a',
        },
        amberGold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        glow: '0 0 20px rgba(217, 119, 6, 0.25)',
      },
    },
  },
  plugins: [],
};
