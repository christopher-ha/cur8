import "../styles/globals.scss";
import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Layout from "@/components/Layout/Layout";
import Head from "next/head";
import "react-image-crop/src/ReactCrop.scss";
// import "cropperjs/dist/cropper.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#333333"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#d3d3d3" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="description"
          content="A project management tool for stylists, designers, and creative directors."
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
