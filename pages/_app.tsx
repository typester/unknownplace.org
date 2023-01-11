import type { AppProps } from 'next/app';
import "../styles/styles.scss";

const MyApp = ({ Component, pageProps }: AppProps) =>
  <Component {...pageProps} />;

export default MyApp;
