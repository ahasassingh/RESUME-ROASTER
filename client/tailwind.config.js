/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#050510',
        'cyber-dark': '#0c0c1d',
        'cyber-gray': '#1e1e2e',
        'neon-pink': '#ff00ff',
        'neon-cyan': '#00ffff',
        'neon-green': '#00ff9f',
        'neon-purple': '#bc13fe',
        'glitch-red': '#ff3333',
        'matrix-dim': '#003300',
        'hacker-green': '#00ff00',
      },
      fontFamily: {
        'mono': ['"Courier New"', 'Courier', 'monospace'],
        'display': ['Orbitron', 'sans-serif'], // We'll stick to mono for valid system fonts if orbitron isn't loaded, but ideally we'd load it.
      },
      animation: {
        'glitch': 'glitch 1s linear infinite',
        'scanline': 'scanline 8s linear infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        glitch: {
          '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
          '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
          '62%': { transform: 'translate(0,0) skew(5deg)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      },
      backgroundImage: {
        'cyber-grid': "linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)",
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
