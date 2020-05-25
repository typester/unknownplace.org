export interface Archive {
  title: string;
  date: string;
  tz: string;
  tags: string[];
  slug: string;
}

export interface ArchiveDetail extends Archive {
  content: string;
}
