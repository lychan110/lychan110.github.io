import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
    site: 'https://yuchinchan.com',
    integrations: [
        mdx(),
        react(),
        tailwind({ applyBaseStyles: false }),
    ],
    // Static output for GitHub Pages
    output: 'static',
});
