export interface Blog {
  title: string;
  tags: string[];
  date: string;
  slug: string[];
}

export interface BlogDetail extends Blog {
  content: string;
}
