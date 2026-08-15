import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './demo/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f2f5f9',
          100: '#e2e9f2',
          200: '#c7d5e7',
          300: '#9db7d4',
          400: '#6c92bd',
          500: '#4a74a5',
          600: '#395c8a',
          700: '#304b70',
          800: '#2b405e',
          900: '#1f3049',
          950: '#141f30',
        },
        wilian: {
          soft: '#e8f0fb',
          DEFAULT: '#3b74c4',
          strong: '#2a5896',
        },
        ana: {
          soft: '#fdeceb',
          DEFAULT: '#e0705f',
          strong: '#b8523f',
        },
        nicolas: {
          soft: '#e6f4ec',
          DEFAULT: '#4a9d6e',
          strong: '#357a53',
        },
        lavanda: {
          soft: '#f0edfa',
          DEFAULT: '#7b6cb0',
        },
        sol: {
          soft: '#fdf3dc',
          DEFAULT: '#d9a441',
        },
        areia: '#faf8f5',
        linha: '#e9e4dc',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '1.25rem',
        pill: '999px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 31, 48, 0.04), 0 8px 24px -12px rgba(20, 31, 48, 0.16)',
        lift: '0 8px 30px -12px rgba(20, 31, 48, 0.35)',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.7)', opacity: '0.4' },
          '60%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-up': {
          '0%': { transform: 'translateY(6px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        pop: 'pop 220ms ease-out',
        'fade-up': 'fade-up 220ms ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
