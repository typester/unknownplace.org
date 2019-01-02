import React from 'react';
import Head from 'next/head';

interface LayoutProps {
  title?: string;
}

export const Layout: React.StatelessComponent<LayoutProps> = ({ title, children }) =>
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{ title }</title>
    </Head>
    {children}
  </div>;
