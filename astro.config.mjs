// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// 站点地址：RSS、sitemap、分享卡片里的绝对链接都靠它
	site: 'https://blog.lifeline20051231.workers.dev',
	integrations: [mdx(), sitemap()],
	markdown: {
		shikiConfig: {
			// 代码高亮：亮色 github-light，暗色自动切 github-dark
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			wrap: true,
		},
	},
});
