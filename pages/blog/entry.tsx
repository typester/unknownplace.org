import React from 'react';
import { BlogEntry, BlogEntryView } from '../../components/blog';
import { Layout } from '../../components/layout';

interface BlogEntryProps {
  entry: BlogEntry;
}

export default class BlogEntryPage extends React.Component<BlogEntryProps> {
  static async getInitialProps({ query }: { query: { entry: BlogEntry } }) {
    return { entry: query.entry };
  };

  render() {
    const { entry } = this.props;
    return (
      <Layout title={entry.title}>
        <div id="blogentry">
          <BlogEntryView entry={entry}/>
        </div>
      </Layout>
    );
  }
}
