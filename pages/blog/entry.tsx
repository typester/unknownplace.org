import React from 'react';
import Error from 'next/error';
import { BlogEntry, BlogEntryView } from '../../components/blog';
import { Layout } from '../../components/layout';

interface BlogEntryProps {
  entry: BlogEntry;
}

interface BlogEntryData {
  default: {
    title: string;
    date: string;
    tags: string[];
    content: string;
    slug: string;
  },
}

export default class BlogEntryPage extends React.Component<BlogEntryProps> {
  static async getInitialProps(context) {
    const data: BlogEntryData = await import(`../../data${context.asPath.replace(/\/$/, "")}.json`)
      .catch(e => console.log("failed to load entry:", e));

    if (!data) {
      return {};
    }

    return {
      entry: {
        ...data.default,
        date: new Date(data.default.date),
        path: context.asPath,
      },
    };
  };

  render() {
    const { entry } = this.props;

    if (!entry) {
      return (
        <Error statusCode={404} />
      );
    }

    return (
      <Layout title={entry.title}>
        <div id="blogentry">
          <BlogEntryView entry={entry}/>
        </div>
      </Layout>
    );
  }
}
