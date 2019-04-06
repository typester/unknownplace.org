const path = require("path");
const fs = require("fs");
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const readfile = promisify(fs.readFile);
const moment = require('moment');
const pagination = require('pagination');

const data_dir = "./data";
const archive_prefix = "archives";
const blog_prefix = "blog";
const entries_per_page = 1;

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

(async () => {
  // archives
  const archive_index = [];
  const archives_files = await scanDir(path.join(data_dir, archive_prefix), ".json");
  for (let f of archives_files) {
    const slug = path.basename(f, ".json");
    if (slug == "index") continue;

    const data = JSON.parse(await readfile(`${f}.json`));

    const archive = {
      title: data.title || "",
      date: new Date(data.date || 0),
      tags: data.tags || [],
      slug,
    };
    archive_index.push(archive);
  }
  archive_index.sort((a, b) => b.date - a.date);

  fs.writeFileSync(
    path.join(data_dir, archive_prefix, "index.json"), 
    JSON.stringify(archive_index)
  );

  // blog
  const blog_entries = [];
  const blog_entries_by_tag = {};
  const blog_entry_files = await scanDir(path.join(data_dir, blog_prefix), ".json");
  for (let f of blog_entry_files) {
    const slug = path.basename(f, ".json");
    if (slug == "index") continue;
    const data = JSON.parse(await readfile(`${f}.json`));

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
    blog_entries.push(entry);
    entry.tags.map(tag => {
      if (!blog_entries_by_tag[tag]) blog_entries_by_tag[tag] = [];
      blog_entries_by_tag[tag].push(entry);
    });
  }

  blog_entries.sort((a, b) => b.date - a.date);
  for (let tag of Object.keys(blog_entries_by_tag)) {
    blog_entries_by_tag[tag].sort((a, b) => b.date - a.date);
  }

  const paginate = (entries, basepath) => {
    const pages = [];
    const total = entries.length;
    for (let i = 1; entries.length > 0; i++) {
      const paginator = new pagination.SearchPaginator({
        prelink: basepath,
        current: i,
        rowsPerPage: entries_per_page,
        slashSeparator: true,
        totalResult: total,
      });
      const page = i == 1 ? basepath : `${basepath}/page/${i}`;
      const e = entries.splice(0, entries_per_page);

      pages.push({
        page,
        data: {
          entries: e,
          paginateData: paginator.getPaginationData(),
        },
      });
    }
    return pages;
  };

  const blog_indexes = paginate(blog_entries.slice(), '/blog');
  for (let index of blog_indexes) {
    const dir = path.join(data_dir, index.page);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "index.json"), JSON.stringify(index.data));
  }

  for (let tag of Object.keys(blog_entries_by_tag)) {
    const blog_tag_indexes = paginate(blog_entries_by_tag[tag].slice(), '/blog/tag/'+tag);
    for (let index of blog_tag_indexes) {
      const dir = path.join(data_dir, index.page);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "index.json"), JSON.stringify(index.data));
    }
  }

})();
