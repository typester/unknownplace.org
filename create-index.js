const path = require("path");
const fs = require("fs");
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const readfile = promisify(fs.readFile);
const moment = require('moment');
const pagination = require('pagination');
const Feed = require("feed").Feed;

const data_dir = "./data";
const archive_prefix = "archives";
const blog_prefix = "blog";
const entries_per_page = 10;

const program = require('commander');

program
  .option('-d, --draft', 'Add draft entries')
  .parse(process.argv);

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
  // clear index files
  for (let f of await scanDir(data_dir, ".json")) {
    if (path.basename(f, ".json") != "index") continue;
    fs.unlinkSync(`${f}.json`);
  }

  // archives
  const archives = [];
  const archive_index = [];
  const archives_files = await scanDir(path.join(data_dir, archive_prefix), ".json");
  for (let f of archives_files) {
    const slug = path.basename(f, ".json");
    if (slug == "index") continue;

    const data = JSON.parse(await readfile(`${f}.json`));

    if (!program.draft && data.tags.find(t => t == "draft")) {
      continue;
    }

    const archive = {
      title: data.title || "",
      date: new Date(data.date || 0),
      tags: data.tags || [],
      slug,
    };
    archives.push({
      ...archive,
      content: data.content,
    });
    archive_index.push(archive);
  }
  archives.sort((a, b) => b.date - a.date);
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

    if (!program.draft && data.tags.find(t => t == "draft")) {
      continue;
    }

    const date = new Date(data.date || 0);
    const p = `/blog/${moment(date).format('YYYY/MM/DD')}/${slug}`;

    const entry = {
      title: data.title || "",
      date,
      tags: data.tags || [],
      content: data.content,
      eid: data.eid,
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

  // Generafe feed
  const archive_feed = new Feed({
    title: "unknownplace.org - archives",
    description: "recent entries for /archives",
    id: "https://unknownplace.org/archives/",
    link: "https://unknownplace.org/archives/",
    updated: archive_index[0].date,
  });
  for (let archive of archives) {
    archive_feed.addItem({
      title: archive.title,
      id: `https://unknownplace.org/archives/${archive.slug}/`,
      link: `https://unknownplace.org/archives/${archive.slug}/`,
      content: archive.content,
      date: archive.date,
    });
  }
  fs.writeFileSync("./static/feeds/archives.xml", archive_feed.rss2());

  const blog_feed = new Feed({
    title: "unknownplace.org - blog",
    description: "recent entries for /blog",
    id: "https://unknownplace.org/blog/",
    link: "https://unknownplace.org/blog/",
    updated: blog_entries[0].date,
  });
  for (let entry of blog_entries.slice().splice(0, 10)) {
    blog_feed.addItem({
      title: entry.title,
      id: `https://unknownplace.org${entry.path}`,
      link: `https://unknownplace.org${entry.path}`,
      content: entry.content,
      date: entry.date,
    });
  }
  fs.writeFileSync("./static/feeds/blog.xml", blog_feed.rss2());

})();
