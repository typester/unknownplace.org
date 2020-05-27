import Link from 'next/link';
import React from 'react';
import { BlogDetail } from '../entities/Blog';

interface BlogEntryViewProps {
  entry: BlogDetail;
}

export const BlogEntryView: React.StatelessComponent<BlogEntryViewProps> = ({ entry }) =>
  <article className="blog">
    <h1>
      <Link href="/blog/[...slug]" as={`/${entry.slug.join('/')}/`}>
        <a>{entry.title}</a>
      </Link>
    </h1>
    <div className="content" dangerouslySetInnerHTML={{__html: entry.content}}/>
    <aside className="meta">
      <Link href="/blog/[...slug]" as={`/blog/${entry.slug.join('/')}/`}><a>{entry.date}</a></Link>
      { entry.tags.length >= 1 &&
        <>
        {' '}/{' '}
        { entry.tags.map((tag, i) =>
          <Link key={i} href="/blog/tag/[tag]" as={"/blog/tag/" + tag}><a>{tag}</a></Link>
        )}
        </>
      }
    </aside>
  </article>;
