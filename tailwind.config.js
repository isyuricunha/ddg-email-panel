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
          'surface-light': '#242424',
        },
        gray: {
          850: '#1f2937',
          750: '#374151',
        },
        accent: {
          orange: '#ea580c',
          'orange-light': '#f97316',
          'orange-dark': '#c2410c',
          yellow: '#eab308',
          'yellow-dark': '#ca8a04',
          'yellow-light': '#facc15',
          gradient: 'linear-gradient(135deg, #ea580c 0%, #eab308 100%)',
        },
        focus: {
          ring: '#f97316',
          'ring-offset': '#111111',
        },
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #ea580c 0%, #eab308 100%)',
        'gradient-accent-hover': 'linear-gradient(135deg, #f97316 0%, #facc15 100%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        fadeIn: 'fadeIn 0.3s ease-in-out',
        slideUp: 'slideUp 0.3s ease-out',
      },
      transitionDuration: {
        250: '250ms',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar')({ nocompatible: true })],
}

