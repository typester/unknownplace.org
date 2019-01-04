import React from 'react';

interface BlogEntryProps {
  json: any;
}

export default class BlogEntry extends React.Component<BlogEntryProps> {
  static async getInitialProps({ query }: { query: {[key: string]: string} }) {
    const json = await import(`../../${query.json}.json`);
    return { json };
  };

  render() {
    return (
      <div>hello {JSON.stringify(this.props)}
      </div>
    );
  }
}
