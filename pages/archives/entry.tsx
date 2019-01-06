import React from 'react';
import Error from 'next/error';
import { Layout } from '../../components/layout';

interface Archive {
  title: string;
  date: Date;
  tags: string[];
  content: string;
}

interface ArchiveEntryProps {
  archive?: Archive;
}

export default class ArchiveEntry extends React.Component<ArchiveEntryProps> {
  static async getInitialProps({ query }: { query: { archive: Archive }}) {
    return { archive: query.archive };
  }
//  static async getInitialProps({ query }: { query: { json: string }}) {
//    if (!query || !query.json) {
//      return {};
//    }
//
//    const json = await import(`../../${query.json}`)
//      .catch(e => console.log(`archive entry ${query.json} not found: ${e}`));
//
//    if (json) {
//      const archive: Archive = {
//        title: json.title,
//        date: new Date(json.date || 0),
//        tags: json.tags || {},
//        content: json.content,
//      };
//      return { archive };
//    }
//    return {};
//  }
//
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
