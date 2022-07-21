import NextDocument, { Html, Head, Main, NextScript } from 'next/document';
import { getCssText } from '~styles/styled';

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="description" content="An inventory app for all things needed" />
          <link rel="icon" href="/favicon.ico" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap"
            rel="stylesheet"
          />
          <link
            rel="preload"
            as="image"
            type="image/svg+xml"
            href="/icon-sprite.svg"
          />
          <style
            id="stitches"
            dangerouslySetInnerHTML={{ __html: getCssText() }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
