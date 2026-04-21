/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                // Preserved from existing site
                'ink':    '#1E1E1C',
                'paper':  '#E8E6E3',
                'teal':   '#8CC1DB',
                // Extended palette
                'ink-2':  '#2A2A28',
                'ink-3':  '#3A3A38',
                'muted':  '#6B6B69',
                'teal-dim': '#5A99B8',
            },
            fontFamily: {
                // Display: editorial, slightly unexpected
                display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
                // Body: clean and legible
                body:    ['"Lato"', 'sans-serif'],
                // Mono: for tags and code
                mono:    ['"JetBrains Mono"', 'monospace'],
            },
            fontSize: {
                '2xs': '0.65rem',
            },
            letterSpacing: {
                widest: '0.25em',
            },
            backgroundImage: {
                // Subtle noise texture via SVG data URI — applied to hero
                'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
            },
            animation: {
                'fade-up':   'fadeUp 0.6s ease forwards',
                'fade-in':   'fadeIn 0.4s ease forwards',
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
            },
        },
    },
    safelist: [
        // STATUS_COLORS in ProjectGrid.tsx — dynamic class strings won't survive purge
        'text-teal',
        'text-paper/60',
        'text-muted',
    ],
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
