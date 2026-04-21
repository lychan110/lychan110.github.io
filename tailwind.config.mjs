/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                ink:        'rgb(var(--tw-ink) / <alpha-value>)',
                inkSoft:    'rgb(var(--tw-ink-soft) / <alpha-value>)',
                paper:      'rgb(var(--tw-paper) / <alpha-value>)',
                paperDeep:  'rgb(var(--tw-paper-deep) / <alpha-value>)',
                paperSoft:  'rgb(var(--tw-paper-soft) / <alpha-value>)',
                teal:       'rgb(var(--tw-teal) / <alpha-value>)',
                tealPale:   'rgb(var(--tw-teal-pale) / <alpha-value>)',
                tealDeep:   'rgb(var(--tw-teal-deep) / <alpha-value>)',
                coral:      'rgb(var(--tw-coral) / <alpha-value>)',
                ochre:      'rgb(var(--tw-ochre) / <alpha-value>)',
                sage:       'rgb(var(--tw-sage) / <alpha-value>)',
                rust:       'rgb(var(--tw-rust) / <alpha-value>)',
                muted:      'rgb(var(--tw-muted) / <alpha-value>)',
            },
            fontFamily: {
                display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
                body:    ['"Lato"', 'system-ui', 'sans-serif'],
                mono:    ['"JetBrains Mono"', 'Menlo', 'Consolas', 'monospace'],
                hand:    ['"Caveat"', 'cursive'],
            },
            fontSize: {
                '2xs': ['0.65rem', { lineHeight: '1' }],
                '3xs': ['0.55rem', { lineHeight: '1' }],
            },
            letterSpacing: {
                widest: '0.25em',
            },
            animation: {
                'fade-up':    'fadeUp 0.4s ease forwards',
                'fade-in':    'fadeIn 0.4s ease forwards',
                'page-enter': 'pageEnter 0.4s ease forwards',
            },
            keyframes: {
                fadeUp: {
                    '0%':   { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%':   { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                pageEnter: {
                    '0%':   { opacity: '0', transform: 'translateY(6px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    safelist: [
        // Dynamically built class strings in ProjectGrid.tsx
        'text-teal', 'text-ink', 'text-muted',
        'bg-ink', 'bg-paper',
        'pill', 'pill.active',
    ],
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
