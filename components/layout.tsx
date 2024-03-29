import Head from 'next/head';
import Link from "next/link";
import React, { FunctionComponent } from 'react';

interface LayoutProps {
  title?: string;
  url?: string;
  image?: string;
}

export const Layout: FunctionComponent<LayoutProps> = ({ title, url, image, children }) =>
  <div>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/brands.css" integrity="sha384-1KLgFVb/gHrlDGLFPgMbeedi6tQBLcWvyNUN+YKXbD7ZFbjX6BLpMDf0PJ32XJfX" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/fontawesome.css" integrity="sha384-jLuaxTTBR42U2qJ/pm4JRouHkEDHkVqH0T1nyQXn1mZ7Snycpf6Rl25VBNthU4z0" crossOrigin="anonymous"/>
      <title>{ title ? `${title} - ` : '' }unknownplace.org</title>
      <meta property="og:title" content={title || 'unknownplace.org'} />
      { title ? <meta property="og:type" content="article" /> : <meta property="og:type" content="website" /> }
      <meta property="og:site_name" content="unknownplace.org" />
      { url && <meta property="og:url" content={url} /> }
      { image && <meta property="og:image" content={image} /> }
    </Head>

    <section className="section">
      <div className="container">
        <nav className="navbar" role="navigation">
          <div className="navbar-brand">
            <div className="navbar-item">
              <Link href="/">
                <a id="logo">unknownplace.org</a>
              </Link>
            </div>

            <div className="navbar-item">
              <Link href="/blog/">
                <a>blog</a>
              </Link>
            </div>
            <div className="navbar-item">
              <Link href="/archives/">
                <a>archives</a>
              </Link>
            </div>
          </div>
        </nav>

        {children}

        <footer className="footer">
          <div className="content has-text-centered">
            <p>Copyright &copy; 2005-{ new Date().getFullYear() } by typester</p>
            <p>Site generated by <a href="http://orgmode.org/">org-mode</a> and <a href="https://nextjs.org/">Next.js</a>.</p>
          </div>
        </footer>
      </div>
    </section>

  </div>;
