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
      minWidth: {
        '300': '300px',
        '1/2': '50%',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
}