/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Core palette
                ink:        '#1E1E1C',
                inkSoft:    '#3A3A37',
                paper:      '#E8E6E3',
                paperDeep:  '#DFDCD7',
                paperSoft:  '#F2F0EC',
                // Accent
                teal:       '#2E8CA6',
                tealPale:   '#8CC1DB',
                tealDeep:   '#1F6B80',
                // Alt accents (optional)
                coral:      '#D88A73',
                ochre:      '#C9A961',
                sage:       '#9FB79B',
                rust:       '#B5593C',
                // Utility
                muted:      '#6B6762',
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
