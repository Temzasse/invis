import { type NextPage } from 'next';
import Head from 'next/head';

import { Text } from '~/components/uikit';

// https://github.com/shadowwalker/next-pwa#offline-fallbacks
export default function Offline() {
  return (
    <>
      <Head>
        <title>Offline</title>
      </Head>

      <div>
        <Text variant="title1">Sivua ei voitu ladata</Text>
      </div>
    </>
  );
}
