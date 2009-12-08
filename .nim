log_level: debug

data_dir: ./data
site_dir: ./public

plugins:
  - module: Entry::File
  - module: Entry::Clmemo
    config:
      file: './clmemo.txt'
#      limit: 30

  - module: Meta
  - module: Markdown

  - module: EmacsColor
    config:
      filter: 'my [\$\@\%]'

  - module: Render::Entry
    rule:
      expression: $entry->path !~ /^clmemo/;

  - module: Render::Entry
    rule:
      expression: $entry->path =~ /^clmemo/;
    config:
      path: memo/<?= $year ?>/<?= $month ?>/<?= $day ?>
      filename: '<?= $filename ?>/index.html'

  - module: AutoIndex
    config:
      filter: $entry->path !~ /^clmemo/;

  - module: AutoIndex
    config:
      filter: $entry->path =~ /^clmemo/;
      path: memo/<?= $year ?>/<?= $month ?>/<?= $day ?>

  - module: AutoIndex
    config:
      filter: $entry->path =~ /^clmemo/;
      path: memo

  - module: AutoIndex
    config:
      filter: $entry->path =~ /^clmemo/;
      path: memo/tag/<?= $tag ?>

  - module: AutoIndex
    config:
      filter: $entry->path =~ /^clmemo/;
      path: memo
      filename: index.rss

  - module: Paginate
    config:
      filter: $page->filename !~ /\.rss/
      entries_per_page: 10
