import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
    type: 'content',
    schema: z.object({
        title:    z.string(),
        date:     z.string(), // YYYY-MM-DD
        status:   z.enum(['complete', 'ongoing', 'archived']),
        category: z.enum(['personal', 'academic', 'work']),
        tags:     z.array(z.string()),
        summary:  z.string().max(300),
        demo_url:  z.string().url().optional().or(z.literal('')),
        repo_url:  z.string().url().optional().or(z.literal('')),
        paper_url: z.string().url().optional().or(z.literal('')),
        image:    z.string().optional(),
        featured: z.boolean().default(false),
    }),
});

export const collections = { projects };
