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
        // Apple Glass 2026 Design System
        glass: {
          50: 'rgba(255, 255, 255, 0.05)',
          100: 'rgba(255, 255, 255, 0.1)',
          200: 'rgba(255, 255, 255, 0.15)',
          300: 'rgba(255, 255, 255, 0.2)',
          400: 'rgba(255, 255, 255, 0.25)',
          500: 'rgba(255, 255, 255, 0.3)',
          600: 'rgba(255, 255, 255, 0.4)',
          700: 'rgba(255, 255, 255, 0.5)',
          800: 'rgba(255, 255, 255, 0.6)',
          900: 'rgba(255, 255, 255, 0.7)',
        },
        // Water-inspired colors
        water: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Glass morphism colors
        'glass-blue': 'rgba(59, 130, 246, 0.1)',
        'glass-purple': 'rgba(147, 51, 234, 0.1)',
        'glass-green': 'rgba(16, 185, 129, 0.1)',
        'glass-orange': 'rgba(249, 115, 22, 0.1)',
        'glass-pink': 'rgba(236, 72, 153, 0.1)',
      },
      // iOS-like shadows
      boxShadow: {
        'ios-sm': '0 1px 3px rgba(0, 0, 0, 0.12)',
        'ios': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'ios-md': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'ios-lg': '0 10px 30px rgba(0, 0, 0, 0.15)',
        'ios-xl': '0 15px 40px rgba(0, 0, 0, 0.12)',
        'ios-2xl': '0 20px 50px rgba(0, 0, 0, 0.15)',
        // Glassmorphic shadows
        'glass-sm': '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'glass-md': '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'glass-xl': '0 20px 56px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'glass-2xl': '0 24px 64px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'glass-inner': 'inset 0 8px 32px rgba(0, 0, 0, 0.12)',
        'glass-colorful': '0 8px 32px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
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
        // Glassmorphic animations
        'glass-in': 'glassIn 600ms ease-out',
        'glass-out': 'glassOut 300ms ease-in',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glass': 'pulseGlass 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
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
        // Glassmorphic keyframes
        glassIn: {
          '0%': { opacity: '0', transform: 'scale(0.8) translateY(20px)' },
          '50%': { opacity: '0.5', transform: 'scale(0.9) translateY(-5px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        glassOut: {
          '0%': { opacity: '1', transform: 'scale(1) translateY(0)' },
          '100%': { opacity: '0', transform: 'scale(0.8) translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlass: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '0.9' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
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
    require('@tailwindcss/backdrop-blur'),
  ],
}
