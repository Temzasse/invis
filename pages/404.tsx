import type { NextPage } from 'next';
import Head from 'next/head';

import { Text } from '~components/uikit';

const NotFound: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sivua ei löytynyt</title>
      </Head>

      <div>
        <Text variant="title1">Sivua ei löytynyt</Text>
      </div>
    </>
  );
};

export default NotFound;
