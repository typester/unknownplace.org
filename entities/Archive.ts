export interface Archive {
  title: string;
  date: string;
  tags: string[];
  slug: string;
}

export interface ArchiveDetail extends Archive {
  content: string;
}
