import NextDocument, { Html, Head, Main, NextScript } from 'next/document';

import { getCssText } from '~styles/styled';
import { AppMeta } from '~components/pwa/AppMeta';
import { AppIcon } from '~components/pwa/AppIcon';
import { SplashImages } from '~components/pwa/SplashImages';

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="fi">
        <Head>
          <AppMeta />
          <AppIcon />
          <SplashImages />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;900&display=swap"
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
