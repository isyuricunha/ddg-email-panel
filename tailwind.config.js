module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pure: {
          black: '#000000',
          darker: '#0a0a0a',
          dark: '#111111',
          surface: '#1a1a1a',
        },
        accent: {
          orange: '#ea580c',
          'orange-light': '#f97316',
          yellow: '#eab308',
          'yellow-dark': '#ca8a04',
          gradient: 'linear-gradient(135deg, #ea580c 0%, #eab308 100%)',
        },
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #ea580c 0%, #eab308 100%)',
        'gradient-accent-hover': 'linear-gradient(135deg, #f97316 0%, #facc15 100%)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar')({ nocompatible: true })],
}
