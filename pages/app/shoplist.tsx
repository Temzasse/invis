import type { NextPage } from 'next';
import Head from 'next/head';

import Navbar from '~components/navigation/Navbar';

const Shoplist: NextPage = () => {
  return (
    <>
      <Head>
        <title>Ostoslista</title>
      </Head>

      <Navbar title="Ostoslista" />
    </>
  );
};

export default Shoplist;
