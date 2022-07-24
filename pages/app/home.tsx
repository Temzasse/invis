import type { NextPage } from 'next';
import Head from 'next/head';

import { Icon, Stack } from 'app/components/uikit';
import Navbar from 'app/components/navigation/Navbar';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Invis</title>
      </Head>

      <Navbar title="Invis" />

      <Stack>
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            style={{
              minHeight: 100,
              backgroundColor: '#111',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Stack direction="x">
              <Icon name="checkFilled" color="primary" />
              <Icon name="checkFilled" color="statusFull" />
              <Icon name="checkFilled" color="statusPartial" />
              <Icon name="checkFilled" color="statusMissing" />
            </Stack>
          </div>
        ))}
      </Stack>
    </>
  );
};

export function getServerSideProps() {
  return {
    props: {},
  };
}

export default Home;
