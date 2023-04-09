import Head from 'next/head';

import { withApiSession } from '~server/api/root';
import Navbar from '~components/navigation/Navbar';

export const getServerSideProps = withApiSession();

export default function Shoplist() {
  return (
    <>
      <Head>
        <title>Ostoslista</title>
      </Head>

      <Navbar title="Ostoslista" />
    </>
  );
}
