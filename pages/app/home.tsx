import type { NextPage } from 'next';
import Head from 'next/head';

import { Stack } from 'app/components/uikit';
import Navbar from 'app/components/navigation/Navbar';
import ItemRow from '~components/project/ItemRow';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Invis</title>
      </Head>

      <Navbar title="Invis" />

      <Stack direction="y" spacing="none">
        {Array.from({ length: 30 }).map((_, i) => (
          <ItemRow
            key={i}
            status={pickRandomFromArray(['missing', 'partial', 'full'])}
            name="Kananmuna"
          />
        ))}
      </Stack>
    </>
  );
};

function pickRandomFromArray(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getServerSideProps() {
  return {
    props: {},
  };
}

export default Home;
