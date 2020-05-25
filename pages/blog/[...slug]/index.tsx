import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React, { FunctionComponent } from 'react';
import { BlogDetail } from '../../../entities/Blog';
import { readBlogs } from '../../../utils/loader';
import Error from 'next/error';
import { Layout } from '../../../components/layout';
import { BlogEntryView } from '../../../components/blog';

interface BlogEntryParams extends ParsedUrlQuery {
  slug: string[];
}

interface BlogEntryProps {
  entry?: BlogDetail;
}

const BlogEntry: FunctionComponent<BlogEntryProps> = ({ entry }) => {
  if (!entry) {
    return (
      <Error statusCode={404} />
    );
  }

  return (
    <Layout title={entry.title} url={`https://unknownplace.org/blog/${entry.slug.join('/')}/`}>
      <div id="blogentry">
        <BlogEntryView entry={entry}/>
      </div>
    </Layout>
  );
};

export default BlogEntry;

export const getStaticPaths: GetStaticPaths = async () => {
  const entries = await readBlogs();
  const paths = entries.map(e => ({
    params: { slug: e.slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<BlogEntryProps, BlogEntryParams> = async ({ params }) => {
  let entry: BlogDetail | undefined;

  if (params) {
    const entries = await readBlogs();
    entry = entries.find(e => e.slug[0] == params.slug[0]
                         && e.slug[1] == params.slug[1]
                         && e.slug[2] == params.slug[2]
                         && e.slug[3] == params.slug[3]);
  }

  return {
    props: { entry },
  };
};
