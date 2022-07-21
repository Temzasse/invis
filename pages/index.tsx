import type { NextPage } from 'next';
import Head from 'next/head';

import { styled } from '~styles/stitches.config';

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Invis</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <Title>Hello world!</Title>
      </Main>
    </Layout>
  );
};

const Layout = styled('main', {
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const Main = styled('main', {
  padding: 40,
});

const Title = styled('h1', {
  color: '#fff',
});

export default Home;