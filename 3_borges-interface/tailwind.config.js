/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    // Constitution Principle VIII: Mobile-First Responsive Breakpoints
    screens: {
      'xs': '375px',      // Small phones
      'sm': '640px',      // Large phones
      'md': '768px',      // Tablets
      'lg': '1024px',     // Desktop
      'xl': '1280px',     // Large desktop
      '2xl': '1536px',    // Extra large
    },
    extend: {
      colors: {
        // Datack Brand Colors - DARK THEME (Cycle 006)
        'datack-yellow': '#dbff3b',       // Primary accent (neon lime)
        'datack-yellow-bright': '#e5ff6b', // Lighter accent for hover
        'datack-black': '#0a0a0a',        // Primary background
        'datack-dark': '#0a0a0a',         // Alias for background
        'datack-panel': '#141414',        // Elevated surfaces (panels)
        'datack-light': '#f5f5f5',        // Primary text (light on dark)
        'datack-light-muted': '#d4d4d4',  // Secondary text
        'datack-gray': '#9d9d9d',         // Muted text
        // Semantic aliases
        'datack-accent': '#dbff3b',
        'datack-secondary': '#1a1a1a',    // Secondary surfaces
        'datack-muted': '#9d9d9d',
        'datack-border': '#2a2a2a',       // Subtle borders
        'datack-hover': '#e5ff6b',
        'datack-black-hover': '#1a1a1a',  // Hover state for black bg
      },
      fontFamily: {
        'datack': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        // Mobile-first responsive typography (min 16px body)
        'display': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-mobile': ['1.75rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h1': ['2rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h1-mobile': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h2': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h2-mobile': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h3': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'h3-mobile': ['1.125rem', { lineHeight: '1.4', fontWeight: '500' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      borderRadius: {
        'datack-sm': '4px',
        'datack-md': '8px',
        'datack-lg': '12px',
      },
      boxShadow: {
        // Dark theme shadows
        'datack-sm': '0 1px 2px rgba(0,0,0,0.4)',
        'datack-md': '0 4px 6px rgba(0,0,0,0.5)',
        'datack-lg': '0 10px 15px rgba(0,0,0,0.6)',
        'datack-glow': '0 0 20px rgba(219, 255, 59, 0.3)',
      },
      // Touch-friendly spacing (Constitution Principle VIII: 44x44px touch targets)
      spacing: {
        'touch': '44px',
        'touch-sm': '36px',
      },
      minWidth: {
        'touch': '44px',
      },
      minHeight: {
        'touch': '44px',
      },
    },
  },
  plugins: [],
}
