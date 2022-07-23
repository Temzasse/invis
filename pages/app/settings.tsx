import type { NextPage } from 'next';
import Head from 'next/head';

import Navbar from '~components/navigation/Navbar';

const Settings: NextPage = () => {
  return (
    <>
      <Head>
        <title>Asetukset</title>
      </Head>

      <Navbar title="Asetukset" />
    </>
  );
};

export default Settings;
