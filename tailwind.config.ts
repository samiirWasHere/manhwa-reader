import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                primary: {
                    DEFAULT: '#8b5cf6',
                    hover: '#a78bfa',
                    dark: '#7c3aed',
                },
                secondary: {
                    DEFAULT: '#1a1a2e',
                    light: '#252542',
                    dark: '#0f0f1a',
                },
                accent: {
                    purple: '#8b5cf6',
                    pink: '#ec4899',
                    blue: '#3b82f6',
                    green: '#22c55e',
                    orange: '#f97316',
                },
                surface: {
                    DEFAULT: '#1e1e32',
                    hover: '#2a2a42',
                    border: '#3a3a52',
                },
                text: {
                    primary: '#ffffff',
                    secondary: '#a1a1aa',
                    muted: '#71717a',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'pulse-glow': 'pulseGlow 2s infinite',
                'gradient-x': 'gradientX 3s ease infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' },
                },
                gradientX: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-primary': 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                'gradient-dark': 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
                'glow-lg': '0 0 40px rgba(139, 92, 246, 0.4)',
                'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
                'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4)',
            },
        },
    },
    plugins: [],
};

export default config;
