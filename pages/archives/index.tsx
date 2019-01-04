import React from 'react';
import { Layout } from '../../components/layout';
import moment from 'moment';

interface Archives {
  title: string;
  date: Date;
  tags: string[];
  content: string;
}

interface ArchivesIndexProps {
  archives: { [key: string]: Archives[] }
}

export default class ArchivesIndex extends React.Component<ArchivesIndexProps> {
  static async getInitialProps({ query }: { query: { archives: Archives[] }}) {
    const archives = query.archives;
    if (!archives) return { archives: {} };

    /* split by year */
    const years: { [key:string]: Archives[] } = {};
    for (let a of archives) {
      const yr = a.date.getFullYear();
      if (!years[ yr ]) {
        years[yr] = [];
      }
      years[yr].push(a);
    }

    return { archives: years };
  }

  render() {
    const { archives } = this.props;

    return (
      <Layout title="Archives">
        <div id="archiveindex">
          { Object.keys(archives).sort().reverse().map((yr, i) =>
            <section className="columns year" key={`yr-${i}`}>
              <div className="column is-narrow">
                <h2 className="is-size-3">{yr}</h2>
              </div>
              <div className="column archivelist">
                { archives[yr].map((archive, i) =>
                  <div className="columns is-mobile archive" key={`archive-${i}`}>
                    <div className="column is-narrow date">
                      <div className="is-size-7 has-text-weight-bold archive-date">{moment(archive.date).format("MMM DD")}</div>
                    </div>
                    <div className="column is-size-5 archive-title"><a>{archive.title}</a></div>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </Layout>
    );
  }
}
