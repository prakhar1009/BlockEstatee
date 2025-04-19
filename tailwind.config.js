/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0e7ff',
          100: '#e0d0ff',
          200: '#c7a5fe',
          300: '#a578fa',
          400: '#8c4ff5',
          500: '#6633cc',
          600: '#5425b3',
          700: '#41189a',
          800: '#301177',
          900: '#1a1a6c',
          950: '#0d0c36',
        },
        secondary: {
          50: '#ffeeff',
          100: '#ffd1f0',
          200: '#ffb1e0',
          300: '#ff8cce',
          400: '#ff67b8',
          500: '#ff3366',
          600: '#e92c5f',
          700: '#c81f54',
          800: '#a21545',
          900: '#7a0f37',
          950: '#40071d',
        },
        gradient: {
          start: '#1a1a6c',
          mid: '#6633cc',
          end: '#ff3366',
        },
        sunset: {
          purple: '#6633cc',
          pink: '#ff3366',
          orange: '#ff6633',
          yellow: '#ffcc33',
        },
        night: {
          dark: '#0d0c36',
          light: '#1a1a6c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 7px 14px 0 rgba(65, 69, 88, 0.1), 0 3px 6px 0 rgba(0, 0, 0, 0.07)',
        'glow': '0 0 15px rgba(102, 51, 204, 0.5)',
        'neon': '0 0 10px rgba(255, 51, 102, 0.7)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-sunset': 'linear-gradient(135deg, #1a1a6c 0%, #6633cc 50%, #ff3366 100%)',
        'gradient-purple': 'linear-gradient(135deg, #6633cc 0%, #ff3366 100%)',
        'property-card': 'linear-gradient(135deg, #1a1a6c 0%, #ff3366 100%)',
      },
    },
  },
  plugins: [],
};