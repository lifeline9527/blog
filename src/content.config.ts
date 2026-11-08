import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// 文章都放在 src/content/blog/，支持 .md 和 .mdx
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			// 标签，用于归档和筛选
			tags: z.array(z.string()).default([]),
			// true 时只在本地可见，不会被构建上线
			draft: z.boolean().default(false),
		}),
});

export const collections = { blog };
