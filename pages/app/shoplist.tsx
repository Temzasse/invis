import type { NextPage } from 'next';
import Head from 'next/head';

import { Text } from '~components/uikit';

const Shoplist: NextPage = () => {
  return (
    <>
      <Head>
        <title>Ostoslista</title>
      </Head>

      <div>
        <Text variant="title1">Ostoslista</Text>
      </div>
    </>
  );
};

export default Shoplist;
