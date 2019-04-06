import React from 'react';
import Link from 'next/link';
import moment from 'moment';

export interface BlogEntry {
  title: string;
  date: Date;
  tags: string[];
  content: string;
  slug: string;
  path: string;
}

interface BlogEntryViewProps {
  entry: BlogEntry;
}

export const BlogEntryView: React.StatelessComponent<BlogEntryViewProps> = ({ entry }) =>
  <article className="blog">
    <h1>{entry.title}</h1>
    <div className="content" dangerouslySetInnerHTML={{__html: entry.content}}/>
    <aside className="meta">
      <Link href="/blog/entry" as={entry.path}><a>{moment(entry.date).format()}</a></Link>
      { entry.tags.length >= 1 &&
        <>
        {' '}/{' '}
        { entry.tags.map((tag, i) =>
          <Link key={i} href="/blog" as={"/blog/tag/" + tag}><a>{tag}</a></Link>
        )}
        </>
      }
    </aside>
  </article>;
