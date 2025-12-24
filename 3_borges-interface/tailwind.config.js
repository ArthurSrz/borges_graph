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
        // Datack Brand Colors - LIGHT THEME (Feature 005-agent-orchestration)
        'datack-yellow': '#F5C518',
        'datack-yellow-bright': '#FFD93D',
        'datack-black': '#FAFAFA',        // Light background (inverted for light theme)
        'datack-dark': '#FFFFFF',         // White panels
        'datack-light': '#1A1A1A',        // Dark text (inverted for light theme)
        'datack-gray': '#6B7280',
        // Semantic aliases for easier migration
        'datack-accent': '#F5C518',
        'datack-secondary': '#FFFFFF',    // White panels
        'datack-muted': '#6B7280',
        'datack-border': '#E5E7EB',       // Light gray border
        'datack-hover': '#FFD93D',
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
        // Light theme shadows - softer, less aggressive
        'datack-sm': '0 1px 2px rgba(0,0,0,0.08)',
        'datack-md': '0 4px 6px rgba(0,0,0,0.1)',
        'datack-lg': '0 10px 15px rgba(0,0,0,0.15)',
        'datack-glow': '0 0 20px rgba(245, 197, 24, 0.3)',
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
