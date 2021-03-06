import moment from 'moment';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { FunctionComponent } from 'react';
import { Layout } from '../../components/layout';
import { Blog } from '../../entities/Blog';
import { readBlogs } from '../../utils/loader';

interface BlogIndexProps {
  entries: { [key: string]: Blog[] },
}

const BlogIndex :FunctionComponent<BlogIndexProps> = ({ entries }) => {
  return (
    <Layout title="Blog">
      <Head>
        <link rel="alternate" type="application/rss+xml" href="/static/feeds/blog.xml" />
      </Head>
      <div id="blogindex">
        { Object.keys(entries).sort().reverse().map((yr, i) =>
          <section className="columns year" key={`yr-${i}`}>
            <div className="column is-narrow">
              <h2 className="is-size-3">{yr}</h2>
            </div>
            <div className="column archivelist">
              { entries[yr].map((entry, i) =>
                <div className="columns is-mobile archive" key={`entry-${i}`}>
                  <div className="column is-narrow date">
                    <div className="is-size-7 has-text-weight-bold archive-date">{moment(new Date(entry.date)).format("MMM DD")}</div>
                  </div>
                  <div className="column is-size-5 archive-title">
                    <Link href="/blog/[...slug]" as={`/blog/${entry.slug.join('/')}/`}><a>{entry.title}</a></Link>
                  </div>
                </div>
                )}
            </div>
          </section>
          )}
      </div>
    </Layout>
  );
};

export default BlogIndex;

export const getStaticProps: GetStaticProps<BlogIndexProps> = async () => {
  const entries = await readBlogs();

  /* split by year */
  const years: { [key:string]: Blog[] } = {};
  for (const e of entries) {
    const yr = (new Date(e.date)).getFullYear();
    if (!years[ yr ]) {
      years[yr] = [];
    }
    years[yr].push(e);
  }

  /* sort */
  for (const yr of Object.keys(years)) {
    /* see https://github.com/microsoft/TypeScript/issues/5710 for +new Date */
    years[yr] = years[yr].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }

  return {
    props: {
      entries: years,
    },
  };
};
