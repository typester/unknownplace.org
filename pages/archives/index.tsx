import moment from 'moment';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { Layout } from '../../components/layout';

export interface Archives {
  title: string;
  date: Date;
  tags: string[];
  slug: string;
}

export interface ArchivesIndexProps {
  archives: { [key: string]: Archives[] }
}

export default class ArchivesIndex extends React.Component<ArchivesIndexProps> {
  static async getInitialProps() {
    const index = await import("../../data/archives/index.json");
    const archives: Archives[] = index.default.map(i => ({
      ...i,
      date: new Date(i.date),
    }));

    /* split by year */
    const years: { [key:string]: Archives[] } = {};
    for (let a of archives) {
      /* inflate date */
      a.date = new Date(a.date || 0);

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
        <Head>
          <link rel="alternate" type="application/rss+xml" href="/static/feeds/archives.xml" />
        </Head>
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
                    <div className="column is-size-5 archive-title">
                      <Link href="/archives/entry" as={`/archives/${archive.slug}`}><a>{archive.title}</a></Link>
                    </div>
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
