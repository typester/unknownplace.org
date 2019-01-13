const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const readfile = promisify(fs.readFile);
const moment = require('moment');

const ENTRIES_PER_PAGE = 1;

const scanDir = async (dir, ext) => {
  let res = [];
  const files = await readdir(dir, { withFileTypes: true });
  for (let f of files) {
    if (f.isFile() && path.extname(f.name) == ext) {
      const basename = path.join(dir, path.basename(f.name, ext));
      res.push(basename);
    } else if (f.isDirectory()) {
      res = res.concat( await scanDir(path.join(dir, f.name), ext) );
    }
  }
  return res;
};

const withTypescript = require('@zeit/next-typescript')
const withSass = require('@zeit/next-sass')
module.exports = {
  ...withTypescript(withSass()),

  useFileSystemPublicRoutes: false,

  exportPathMap: async () => {
    const map = {
      '/': { page: '/index' },
    };

    /* archives */
    const archives = [];
    const archives_files = await scanDir('./data/archives', '.json');
    for (let f of archives_files) {
      const data = JSON.parse(await readfile(`${f}.json`));
      const slug = path.basename(f, '.json');

      const archive = {
        title: data.title || "",
        date: new Date(data.date || 0),
        tags: data.tags || [],
        content: data.content,
        slug,
      };
      archives.push(archive);

      map[`/archives/${slug}`] = { page: '/archives/entry', query: { archive } };
    }
    archives.sort((a, b) => b.date - a.date);
    map['/archives'] = { page: '/archives', query: { archives } };

    /* blog */
    const entries = [];
    const entries_by_tag = {};
    const entry_files = await scanDir('./data/blog', '.json');
    for (let f of entry_files) {
      const data = JSON.parse(await readfile(`${f}.json`));
      const slug = path.basename(f, '.json');

      const date = new Date(data.date || 0);
      const p = `/blog/${moment(date).format('YYYY/MM/DD')}/${slug}`;

      const entry = {
        title: data.title || "",
        date,
        tags: data.tags || [],
        content: data.content,
        slug,
        path: p,
      };

      entries.push(entry);
      entry.tags.map(t => {
        if (!entries_by_tag[t]) entries_by_tag[t] = [];
        entries_by_tag[t].push(entry);
      })

      map[p] = {
        page: '/blog/entry',
        query: { entry },
      };
    }
    entries.sort((a, b) => b.date - a.date);

    const pagenate = (entries, basepath) => {
      for (let i = 1; entries.length > 0; i++) {
        const p = i == 1 ? basepath : `${basepath}/${i}`;
        const e = entries.splice(0, ENTRIES_PER_PAGE);
        map[p] = { page: '/blog', query: { entries: e } };
      }
    };
    pagenate(entries.slice(), '/blog');

    for (let t of Object.keys(entries_by_tag)) {
      pagenate(entries_by_tag[t].slice(), `/blog/tags/${t}`);
    }

    console.log('urlMap', map);

    return map;
  },
}
