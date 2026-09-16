/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F6F3EC',
        ink: '#12130F',
        lime: '#C6F135',
        coral: '#FF6B4A',
        navy: '#161B33',
      },
      fontFamily: {
        display: ['var(--font-grotesk)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        chunky: '1.25rem',
      },
      boxShadow: {
        block: '6px 6px 0px 0px rgba(18,19,15,1)',
        blockSm: '3px 3px 0px 0px rgba(18,19,15,1)',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        pop: 'pop 0.25s ease-out',
      },
    },
  },
  plugins: [],
};
