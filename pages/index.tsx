import { type GetServerSideProps } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import {
  SplashScreen,
  useSplashScreen,
} from '~/components/navigation/SplashScreen';

import { styled } from '~/styles/styled';
import { Button, Stack } from '~/components/uikit';
import { getProjectFromCookies } from '~/server/utils/project';

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
            <BackgroundGrid />

            <Header
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <Image
                src="/images/text-logo.png"
                width={60}
                height={30}
                style={{ objectFit: 'contain' }}
                alt="Invis logo"
              />
            </Header>

            <Content>
              <Stack direction="y" spacing="regular">
                <Title>Pysy kärryillä elämän menoista</Title>
                <Link href="/login" passHref legacyBehavior>
                  <Button asLink>Liity projektiin</Button>
                </Link>
                <Link href="/new" passHref legacyBehavior>
                  <Button asLink variant="outlined">
                    Luo oma projekti
                  </Button>
                </Link>
              </Stack>
            </Content>
          </Main>
        )}
      </AnimatePresence>
    </>
  );
}

const Main = styled(motion.main, {
  position: 'relative',
  viewportMinHeight: 100,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  safeAreaInsets: 'padding',
});

const BackgroundGrid = styled('div', {
  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(241 245 249 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
  backgroundPosition: 'center top -1px',
  WebkitMaskImage: 'linear-gradient(0deg,#0000,#000)',
  MaskImage: 'linear-gradient(0deg,#0000,#000)',
  fixedFill: true,
  pointerEvents: 'none',
});

const Header = styled(motion.div, {
  position: 'fixed',
  top: 'max(0px, env(safe-area-inset-top))',
  left: 0,
  right: 0,
  padding: '$regular',
  display: 'flex',
  justifyContent: 'center',
  background: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))',
});

const Content = styled('div', {
  padding: '$regular',
});

const Title = styled('h1', {
  typography: '$title1',
  gradientText: true,
});

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const project = await getProjectFromCookies(req.cookies);

  return {
    props: {},
    redirect: project
      ? { destination: '/app/home', permanent: false }
      : undefined,
  };
};
