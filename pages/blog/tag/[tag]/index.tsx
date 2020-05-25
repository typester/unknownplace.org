import React, { FunctionComponent } from 'react';
import moment from 'moment';
import { Layout } from '../../../../components/layout';
import Head from 'next/head';
import { Blog } from '../../../../entities/Blog';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { readBlogs } from '../../../../utils/loader';
import { ParsedUrlQuery } from 'querystring';

interface TagIndexParams extends ParsedUrlQuery {
  tag: string;
}

interface TagIndexProps {
  tag: string;
  entries: { [key: string]: Blog[] },
}

const TagIndex: FunctionComponent<TagIndexProps> = ({ tag, entries }) => {
  return (
    <Layout title={`Blog - Tag:${tag}`}>
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

export default TagIndex;

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await readBlogs();

  const tags: { [key: string]: number } = {};
  for (const e of entries) {
    for (const t of e.tags) {
      tags[t]++;
    }
  }

  const paths = Object.keys(tags).map(t => ({
    params: { tag: t },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<TagIndexProps, TagIndexParams> = async ({ params }) => {
  if (!params) {
    throw new Error('params is required');
  }

  const entries = (await readBlogs()).filter(e => e.tags.find(t => t == params.tag));

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
      tag: params.tag,
      entries: years,
    },
  };
};

