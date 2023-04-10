import { type GetServerSideProps } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';

import {
  SplashScreen,
  useSplashScreen,
} from '~components/navigation/SplashScreen';

import { styled } from '~styles/styled';
import { Stack, Text } from '~components/uikit';
import Link from 'next/link';

export default function Landing() {
  const isSplashVisible = useSplashScreen();

  return (
    <>
      <Head>
        <title>Invis</title>
      </Head>

      <AnimatePresence initial={false}>
        {isSplashVisible ? (
          <SplashScreen />
        ) : (
          <Main key="main">
            <Stack direction="y" spacing="small">
              <Text variant="body">Invis</Text>
              <Link href="/login">
                <Text variant="body">Kirjaudu sisään</Text>
              </Link>
              <Link href="/new">
                <Text variant="body">Luo oma projekti</Text>
              </Link>
            </Stack>
          </Main>
        )}
      </AnimatePresence>
    </>
  );
}

const Main = styled(motion.main, {
  height: '100%',
});

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return {
    props: {},
    redirect: req.cookies.project
      ? { destination: '/app/home', permanent: false }
      : undefined,
  };
};
