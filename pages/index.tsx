import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';

import { isRunningStandalone } from '~utils-app/pwa';
import { Text } from '~components/uikit';

const Landing: NextPage = () => {
  const isStandalone = isRunningStandalone();

  // TODO: show installation instructions for non-standalone mode

  return (
    <>
      <Head>
        <title>Invis</title>
      </Head>

      <div>
        <Text variant="title1">Landing</Text>
        {isStandalone && <Text variant="title2">Standalone</Text>}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { project } = req.cookies;

  return {
    props: {},
    redirect: project ? { destination: '/app/home' } : undefined,
  };
};

export default Landing;
