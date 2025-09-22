/** @type {import('tailwindcss').Config} */
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['SF Pro Display', ...fontFamily.sans],
        'sf-pro': ['SF Pro Display', 'sans-serif'],
        'sf-pro-text': ['SF Pro Text', 'sans-serif'],
      },
      colors: {
        // iOS System Colors
        ios: {
          blue: '#007AFF',
          green: '#34C759',
          indigo: '#5856D6',
          orange: '#FF9500',
          pink: '#FF2D55',
          purple: '#AF52DE',
          red: '#FF3B30',
          teal: '#5AC8FA',
          yellow: '#FFCC00',
          // Grayscale
          gray: {
            1: '#8E8E93',
            2: '#AEAEB2',
            3: '#C7C7CC',
            4: '#D1D1D6',
            5: '#E5E5EA',
            6: '#F2F2F7',
          },
          // Backgrounds
          background: {
            primary: '#FFFFFF',
            secondary: '#F2F2F7',
            tertiary: '#FFFFFF',
          },
          // Labels
          label: {
            primary: '#000000',
            secondary: '#3C3C4399', // 60% opacity
            tertiary: '#3C3C434D', // 30% opacity
            quaternary: '#3C3C432D', // 18% opacity
          },
          // Fill
          fill: {
            primary: '#78788033', // 20% opacity
            secondary: '#78788029', // 16% opacity
            tertiary: '#7676801F', // 12% opacity
            quaternary: '#74748014', // 8% opacity
          },
        },
      },
      // iOS-like shadows
      boxShadow: {
        'ios-sm': '0 1px 3px rgba(0, 0, 0, 0.12)',
        'ios': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'ios-md': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'ios-lg': '0 10px 30px rgba(0, 0, 0, 0.15)',
        'ios-xl': '0 15px 40px rgba(0, 0, 0, 0.12)',
        'ios-2xl': '0 20px 50px rgba(0, 0, 0, 0.15)',
      },
      // iOS-like border radius
      borderRadius: {
        'ios-sm': '6px',
        'ios': '10px',
        'ios-md': '12px',
        'ios-lg': '14px',
        'ios-xl': '16px',
        'ios-2xl': '20px',
        'ios-full': '9999px',
      },
      // iOS-like transitions
      transitionTimingFunction: {
        'ios': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        'ios-bounce': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      // iOS-like animations
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'fade-out': 'fadeOut 200ms ease-in',
        'scale-in': 'scaleIn 200ms ease-out',
        'scale-out': 'scaleOut 200ms ease-in',
        'slide-up': 'slideUp 200ms ease-out',
        'slide-down': 'slideDown 200ms ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(20px)', opacity: '0' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
