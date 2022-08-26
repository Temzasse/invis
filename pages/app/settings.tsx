import Head from 'next/head';
import Link from 'next/link';

import { styled } from '~styles/styled';
import { Button } from '~components/uikit';
import Navbar from '~components/navigation/Navbar';

export default function Settings() {
  return (
    <>
      <Head>
        <title>Asetukset</title>
      </Head>

      <Navbar title="Asetukset" />

      <Content></Content>

      <Link href="/api/logout" passHref>
        <Button asLink variant="outlined">
          Logout
        </Button>
      </Link>
    </>
  );
}

const Content = styled('main', {
  flex: 1,
});
