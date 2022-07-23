import type { NextPage } from 'next';
import Head from 'next/head';

import { Text } from '~components/uikit';

const Categories: NextPage = () => {
  return (
    <>
      <Head>
        <title>Kategoriat</title>
      </Head>

      <div>
        <Text variant="title1">Kategoriat</Text>
      </div>
    </>
  );
};

export default Categories;
