import Error from 'next/error';
import Head from 'next/head';
import { TemplatePaginatorVariables } from 'pagination';
import React from 'react';
import { BlogEntry, BlogEntryView } from '../../components/blog';
import { Layout } from '../../components/layout';
import { Pager } from '../../components/pager';

interface BlogIndexProps {
  entries: BlogEntry[];
  paginateData: TemplatePaginatorVariables;
}

interface BlogIndexData {
  default: {
    paginateData: TemplatePaginatorVariables;
    entries: {
      title: string;
      tags: string[];
      date: Date;
      content: string;
      slug: string;
      path: string;
    }[];
  },
}

export default class BlogIndex extends React.Component<BlogIndexProps> {
  static async getInitialProps(context) {
    const data: BlogIndexData = await import(`../../data${context.asPath.replace(/\/$/, "")}/index.json`)
      .catch(e => console.log("failed to load entry:", e));
    if (!data) return {};

    const entries: BlogEntry[] = data.default.entries.map(e => ({
      ...e,
      date: new Date(e.date),
    }));

    return {
      paginateData: data.default.paginateData,
      entries,
    };
  }

  render() {
    const { entries, paginateData } = this.props;

    if (!entries || !paginateData) {
      return (
        <Error statusCode={404} />
      );
    }

    return (
      <Layout title="Blog">
        <Head>
          <link rel="alternate" type="application/rss+xml" href="/static/feeds/blog.xml" />
        </Head>
        <div id="blogindex">
          { entries.map((e, i) =>
            <BlogEntryView key={i} entry={e} />
          )}
          <Pager data={paginateData} />
        </div>
      </Layout>
    );
  }
}
