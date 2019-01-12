import React from 'react';
import { Layout } from '../../components/layout';
import { BlogEntry, BlogEntryView } from '../../components/blog';

interface BlogIndexProps {
  entries: BlogEntry[];
}

export default class BlogIndex extends React.Component<BlogIndexProps> {
  static async getInitialProps({ query }: { query: { entries: BlogEntry[] }}) {
    return { entries: query.entries || [] };
  }

  render() {
    const { entries } = this.props;

    return (
      <Layout title="Blog">
        <div id="blogindex">
          { entries.map((e, i) =>
            <BlogEntryView key={i} entry={e} />
          )}
        </div>
      </Layout>
    );
  }
}
