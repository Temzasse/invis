import type { NextPage } from 'next';
import Head from 'next/head';

import { Text } from '~components/uikit';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Invis</title>
      </Head>

      <div>
        <Text variant="title1">Invis</Text>
      </div>
    </>
  );
};

export default Home;
