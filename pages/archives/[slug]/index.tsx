import { GetStaticPaths, GetStaticProps } from 'next';
import Error from 'next/error';
import { ParsedUrlQuery } from 'querystring';
import React, { FunctionComponent } from 'react';
import { Layout } from '../../../components/layout';
import { ArchiveDetail } from '../../../entities/Archive';
import { readArchives } from '../../../utils/loader';

interface ArchiveEntryParams extends ParsedUrlQuery {
  slug: string;
}

interface ArchiveEntryProps {
  archive?: ArchiveDetail;
}

const ArchiveEntry: FunctionComponent<ArchiveEntryProps> = ({ archive }) => {
  if (!archive) {
    return (
      <Error statusCode={404} />
    );
  }

  return (
    <Layout title={archive.title} url={`https://unknownplace.org/archives/${archive.slug}/`} image={archive.image}>
      <article className="archive">
        <h1>{archive.title}</h1>
        <div className="content" dangerouslySetInnerHTML={{ __html:  archive.content }} />
      </article>
    </Layout>
  );
};

export default ArchiveEntry;

export const getStaticPaths: GetStaticPaths = async () => {
  const archives = await readArchives();

  const paths = archives.map(a => ({
    params: { slug: a.slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<ArchiveEntryProps, ArchiveEntryParams> = async ({ params }) => {
  let archive: ArchiveDetail | undefined;
  if (params) {
    const archives = await readArchives();
    archive = archives.find(a => a.slug == params.slug);
  }

  return {
    props: { archive },
  };
};
