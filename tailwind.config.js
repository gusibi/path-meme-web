const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#EC1C24',
        secondary: '#660D13',
        background: {
          light: '#f0f0f0',
          dark: '#1a1a1a',
        },
        text: {
          light: '#333',
          dark: '#f0f0f0',
        },
        card: {
          light: '#ffffff',
          dark: '#2a2a2a',
        },
        timeline: {
          light: '#ccc',
          dark: '#555',
        },
      },
      maxWidth: {
        'content': '800px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function ({ addUtilities }) {
      const newUtilities = {
        '.hover\\:bg-primary:hover': {
          backgroundColor: '#EC1C24',
        },
        '.hover\\:bg-secondary:hover': {
          backgroundColor: '#660D13',
        },
        // 可以根据需要添加更多
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
}