import React from 'react';
import Error from 'next/error';
import { Layout } from '../../components/layout';

interface Archive {
  title: string;
  date: Date;
  tags: string[];
  content: string;
}

interface ArchiveData {
  default: {
    title: string;
    date: string;
    tags: string[];
    content: string;
  };
}

interface ArchiveEntryProps {
  archive?: Archive;
}

export default class ArchiveEntry extends React.Component<ArchiveEntryProps> {
  static async getInitialProps(context) {
    const data: ArchiveData = await import(`../../data${context.asPath.replace(/\/$/, "")}.json`)
      .catch(e => console.log("failed to load entry:", e));

    if (!data) {
      return {};
    }

    return {
      archive: {
        ...data.default,
        date: new Date(data.default.date),
      },
    };
  }

  render() {
    const { archive } = this.props;

    if (!archive) {
      return (
        <Error statusCode={404} />
      );
    }

    return (
      <Layout>
        <article className="archive">
          <h1>{archive.title}</h1>
          <div className="content" dangerouslySetInnerHTML={{ __html:  archive.content }} />
        </article>
      </Layout>
    );
  }
}
