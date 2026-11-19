import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
    site: 'https://lychan110.github.io',
    integrations: [
        mdx(),
        react(),
        tailwind({ applyBaseStyles: false }),
    ],
    // Static output for GitHub Pages
    output: 'static',
});
