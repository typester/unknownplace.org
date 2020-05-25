import { promises as fs } from 'fs';
import path from 'path';
import { ArchiveDetail } from '../entities/Archive';
import { BlogDetail } from '../entities/Blog';

const archivesCache: ArchiveDetail[] = [];
const blogCache: BlogDetail[] = [];

export const readArchives = async (): Promise<ArchiveDetail[]> => {
  if (archivesCache.length) {
    return archivesCache;
  }

  const dir = path.join(process.cwd(), 'data', 'archives');
  const files = await fs.readdir(dir);

  for (const f of files) {
    if (!f.match(/\.json$/)) {
      continue;
    }

    const data = await fs.readFile(path.join(dir, f), 'utf-8');
    const json: ArchiveDetail = JSON.parse(data);

    if (process.env.INCLUDE_DRAFTS !== '1') {
      if (json.tags.find(t => t == 'draft')) {
        continue;
      }
    }

    const m = json.date.match(/^(.*?)([+-]\d{4})?$/);
    if (!m || !m[1]) {
      throw new Error(`invalid date format: ${json.date}`);
    }

    archivesCache.push({
      title: json.title,
      date: m[1],
      tz: m[2] || '',
      tags: json.tags,
      content: json.content,
      slug: f.replace(/\.json$/, ''),
    });
  }

  return archivesCache;
};

export const readBlogs = async (): Promise<BlogDetail[]> => {
  if (blogCache.length) {
    return blogCache;
  }

  const dir = path.join(process.cwd(), 'data', 'blog');
  const files = await fs.readdir(dir);

  for (const f of files) {
    const m = f.match(/^(\d{4})-(\d{2})-(\d{2})_(.*).json$/);
    if (!m || m.length != 5) {
      continue;
    }

    const data = await fs.readFile(path.join(dir, f), 'utf-8');
    const json: BlogDetail = JSON.parse(data);

    if (process.env.INCLUDE_DRAFTS !== '1') {
      if (json.tags.find(t => t == 'draft')) {
        continue;
      }
    }

    const md = json.date.match(/^(.*?)([+-]\d{4})?$/);
    if (!md || !md[1]) {
      throw new Error(`invalid date format: ${json.date}`);
    }

    blogCache.push({
      title: json.title,
      date: md[1],
      tz: md[2] || '',
      tags: json.tags,
      content: json.content,
      slug: [m[1], m[2], m[3], m[4]],
    });
  }

  return blogCache;
};
