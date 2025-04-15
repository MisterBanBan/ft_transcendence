/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./public/**/*.{js,ts,jsx,tsx}",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        animation: {
          'spin-slow': 'spin 3s linear infinite',
          'wiggle': 'wiggle 1s ease-in-out infinite',
          'pulse-grow': 'pulseGrow 1.5s infinite',
        },
        keyframes: {
          wiggle: {
            '0%, 100%': { transform: 'rotate(-3deg)' },
            '50%': { transform: 'rotate(3deg)' },
          },
          pulseGrow: {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.3)', filter: 'brightness(1.2)' },
          }
        }
      }
    },
    plugins: [],
  }
  