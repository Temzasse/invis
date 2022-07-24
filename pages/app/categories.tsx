import type { NextPage } from 'next';
import Head from 'next/head';

import Navbar from 'app/components/navigation/Navbar';

const Categories: NextPage = () => {
  return (
    <>
      <Head>
        <title>Kategoriat</title>
      </Head>

      <Navbar title="Kategoriat" />
    </>
  );
};

export default Categories;
