/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#EC1C24',
        secondary: '#660D13',
        path: {
          red: '#EE3524',
          bg: '#FBF8F5',
          dark: '#1a1a1a',
          cardDark: '#262626',
          subtle: '#999999',
          line: '#E0E0E0',
          lineDark: '#404040'
        },
        background: {
          light: '#FBF8F5',
          dark: '#1a1a1a',
        },
        text: {
          light: '#333',
          dark: '#f0f0f0',
        },
        card: {
          light: '#ffffff',
          dark: '#262626',
        },
        timeline: {
          light: '#E0E0E0',
          dark: '#404040',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      maxWidth: {
        'content': '640px',
      },
      minWidth: {
        '300': '300px',
        '1/2': '50%',
      },
      animation: {
        'bounce-soft': 'bounce-soft 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'spin-slow': 'spin 1s linear infinite',
      },
      keyframes: {
        'bounce-soft': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
}
