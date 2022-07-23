import type { NextPage } from 'next';
import Head from 'next/head';

import { Text } from '~components/uikit';

const Settings: NextPage = () => {
  return (
    <>
      <Head>
        <title>Asetukset</title>
      </Head>

      <div>
        <Text variant="title1">Asetukset</Text>
      </div>
    </>
  );
};

export default Settings;
