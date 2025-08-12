/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      keyframes: {
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        spin: 'spin 12s linear infinite',
        float: 'float 4s ease-in-out infinite',
        pulse: 'pulse 3s ease-in-out infinite',
      },
      colors: {
        // Prada luxury color palette
        prada: {
          black: '#000000',
          softBlack: '#1a1a1a',
          charcoal: '#2d2d2d',
          darkGray: '#4a4a4a',
          gray: '#7a7a7a',
          lightGray: '#b8b8b8',
          paleGray: '#e8e8e8',
          offWhite: '#f5f5f5',
          white: '#ffffff',
          red: '#8B0000', // Prada signature red (used sparingly)
        },

        // Semantic colors for the app using Prada palette
        pradaApp: {
          // Primary colors
          primary: '#000000', // Black as primary
          primaryLight: '#1a1a1a',
          primarySoft: '#2d2d2d',

          // Text colors - darker for better readability
          textPrimary: '#000000', // Pure black for main text
          textSecondary: '#2d2d2d', // Darker charcoal for secondary text
          textMuted: '#4a4a4a', // Dark gray for muted text
          textLight: '#6a6a6a', // Medium gray for subtle text

          // Background colors
          bgPrimary: '#ffffff',
          bgSecondary: '#f5f5f5',
          bgTertiary: '#e8e8e8',
          bgElevated: '#fafafa',

          // Border colors
          borderStrong: '#000000',
          borderMedium: '#2d2d2d',
          borderLight: '#b8b8b8', // Slightly darker for better visibility
          borderSubtle: '#d0d0d0', // Darker subtle borders

          // Accent (red used very sparingly)
          accent: '#8B0000',
          accentHover: '#6B0000',

          // UI states
          active: '#000000',
          inactive: '#4a4a4a', // Darker inactive state
          hover: '#f0f0f0',
          disabled: '#a8a8a8', // Darker disabled state
        },
      },
      fontFamily: {
        // Add custom fonts if available
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['SpaceMono', 'monospace'],
      },
      letterSpacing: {
        tightest: '-.05em',
        tighter: '-.025em',
        tight: '-.01em',
        normal: '0',
        wide: '.025em',
        wider: '.05em',
        widest: '.1em',
        luxury: '.2em', // Prada-style wide spacing
        luxuryWide: '.3em',
        luxuryWidest: '.4em',
      },
      fontSize: {
        // Custom font sizes for luxury typography
        'luxury-xs': ['10px', { lineHeight: '1.5', letterSpacing: '0.15em' }],
        'luxury-sm': ['12px', { lineHeight: '1.5', letterSpacing: '0.1em' }],
        'luxury-base': ['14px', { lineHeight: '1.5', letterSpacing: '0.05em' }],
        'luxury-lg': ['16px', { lineHeight: '1.4', letterSpacing: '0.05em' }],
        'luxury-xl': ['20px', { lineHeight: '1.3', letterSpacing: '0.03em' }],
        'luxury-2xl': ['24px', { lineHeight: '1.2', letterSpacing: '0.02em' }],
        'luxury-3xl': ['32px', { lineHeight: '1.1', letterSpacing: '0.01em' }],
        'luxury-4xl': ['40px', { lineHeight: '1', letterSpacing: '0' }],
      },
      borderWidth: {
        hairline: '0.5px',
      },
      boxShadow: {
        'luxury-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        luxury: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'luxury-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'luxury-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'luxury-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'luxury-2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
  ],
  corePlugin: {
    textOpacity: true,
  },
};
