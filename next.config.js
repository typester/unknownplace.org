const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const readfile = promisify(fs.readFile);
const moment = require('moment');
const pagination = require('pagination');

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
      const slug = path.basename(f, '.json');
      if (slug == "index") continue;
      map[`/archives/${slug}`] = { page: '/archives/entry' };
    }
    map['/archives'] = { page: '/archives' };

    /* blog */
    const entries = [];
    const entries_by_tag = {};
    const entry_files = await scanDir('./data/blog', '.json');
    for (let f of entry_files) {
      const slug = path.basename(f, '.json');
      if (slug == "index") {
        // index
        const chunk = path.dirname(f).split(path.sep);
        chunk.shift();          // remove ./data
        map["/" + chunk.join("/")] = { page: "/blog" };
      } else {
        const data = JSON.parse(await readfile(`${f}.json`));

        const date = new Date(data.date || 0);
        const p = `/blog/${moment(date).format('YYYY/MM/DD')}/${slug}`;

        map[p] = { page: '/blog/entry' }
      };
    }

    return map;
  },
}
