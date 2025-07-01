/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./public/**/*.{js,ts,jsx,tsx}",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      screens: {
        'xxs': '280px',
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        'h-xxs': {'raw': '(min-height: 280px)'},
        'h-xs': {'raw': '(min-height: 360px)'},
        'h-sm': {'raw': '(min-height: 640px)'},
        'h-md': {'raw': '(min-height: 768px)'},
        'h-lg': {'raw': '(min-height: 1024px)'},
        'h-xl': {'raw': '(min-height: 1280px)'},
        'h-2xl': {'raw': '(min-height: 1536px)'},
      },
      extend: {
        scale: {
          200: '2',
          300: '3',
          400: '4',
        },
        animation: {
          'spin-slow': 'spin 3s linear infinite',
          'wiggle': 'wiggle 1s ease-in-out infinite',
          'pulse-grow': 'pulseGrow 1.5s infinite',
        },
        fontFamily: {
          omori: ['OMORI_GAME2', 'sans-serif'],
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
  