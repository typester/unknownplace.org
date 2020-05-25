import moment from 'moment';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React, { FunctionComponent } from 'react';
import { Layout } from '../../components/layout';
import { readArchives } from '../../utils/loader';
import { Archive } from '../../entities/Archive';

export interface ArchivesIndexProps {
  archives: { [key: string]: Archive[] }
}

const ArchivesIndex: FunctionComponent<ArchivesIndexProps> = ({ archives }) => {
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
                    <div className="is-size-7 has-text-weight-bold archive-date">{moment(new Date(archive.date)).format("MMM DD")}</div>
                  </div>
                  <div className="column is-size-5 archive-title">
                    <Link href="/archives/[slug]" as={`/archives/${archive.slug}/`}><a>{archive.title}</a></Link>
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
export default ArchivesIndex;

export const getStaticProps: GetStaticProps<ArchivesIndexProps> = async () => {
  const archives = await readArchives();

  /* split by year */
  const years: { [key:string]: Archive[] } = {};
  for (const a of archives) {
    const yr = (new Date(a.date)).getFullYear();
    if (!years[ yr ]) {
      years[yr] = [];
    }
    years[yr].push(a);
  }

  /* sort */
  for (const yr of Object.keys(years)) {
    /* see https://github.com/microsoft/TypeScript/issues/5710 for +new Date */
    years[yr] = years[yr].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }

  return {
    props: {
      archives: years,
    },
  };
};
