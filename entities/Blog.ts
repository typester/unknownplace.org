export interface Blog {
  title: string;
  tags: string[];
  date: string;
  slug: string[];
  image?: string;
}

export interface BlogDetail extends Blog {
  content: string;
}
