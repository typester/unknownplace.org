export interface Archive {
  title: string;
  date: string;
  tags: string[];
  slug: string;
  image?: string;
}

export interface ArchiveDetail extends Archive {
  content: string;
}
