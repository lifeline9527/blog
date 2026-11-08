#!/usr/bin/env node
/**
 * 新建一篇文章：交互式填标题、文件名、摘要、标签，自动生成 frontmatter。
 * 用法：
 *   npm run new
 *   npm run new -- "文章标题" my-slug
 */
import { createInterface } from 'node:readline/promises';
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = join(root, 'src', 'content', 'blog');

const interactive = process.stdin.isTTY;
const rl = interactive
	? createInterface({ input: process.stdin, output: process.stdout })
	: null;

const ask = async (question, fallback = '') => {
	if (!rl) return fallback;
	let answer = '';
	try {
		answer = (await rl.question(question)).trim();
	} catch {
		answer = '';
	}
	return answer || fallback;
};

try {
	let title = process.argv[2];
	if (!title) title = await ask('文章标题：');
	if (!title) throw new Error('标题不能为空');

	let slug = process.argv[3] ?? (await ask('文件名（英文或拼音，如 nginx-notes）：'));
	slug = slug
		.toLowerCase()
		.replace(/[^a-z0-9-]+/g, '-')
		.replace(/^-+|-+$/g, '');
	if (!slug) throw new Error('文件名不能为空');

	const description = await ask('一句话摘要（回车跳过）：');
	const tagsInput = await ask('标签，逗号分隔（回车跳过）：');

	const now = new Date();
	const pad = (n) => String(n).padStart(2, '0');
	const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
	const tags = tagsInput
		.split(/[,，、]/)
		.map((t) => t.trim())
		.filter(Boolean);

	const frontmatter = [
		'---',
		`title: '${title.replace(/'/g, "''")}'`,
		`description: '${description.replace(/'/g, "''")}'`,
		`pubDate: ${date}`,
		tags.length ? `tags: [${tags.map((t) => `'${t}'`).join(', ')}]` : null,
		'draft: true',
		'---',
		'',
		'在这里开始写正文。写完把上面的 `draft: true` 改成 `false`，或者直接删掉这一行。',
		'',
	]
		.filter((line) => line !== null)
		.join('\n');

	mkdirSync(postsDir, { recursive: true });
	const file = join(postsDir, `${slug}.md`);
	if (existsSync(file)) throw new Error(`文件已存在：src/content/blog/${slug}.md`);

	writeFileSync(file, frontmatter, 'utf8');

	console.log('');
	console.log(`已创建：src/content/blog/${slug}.md`);
	console.log(`本地预览：http://localhost:4321/blog/${slug}/`);
	console.log('写完把 draft 改成 false，再 git push 就上线了。');
} catch (error) {
	console.error(`\n出错了：${error.message}`);
	process.exitCode = 1;
} finally {
	if (rl) rl.close();
}
