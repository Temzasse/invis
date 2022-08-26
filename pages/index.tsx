import type { GetServerSideProps } from 'next';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';

import {
  SplashScreen,
  useSplashScreen,
} from '~components/navigation/SplashScreen';

import { styled } from '~styles/styled';
import { isRunningStandalone } from '~app/utils/pwa';
import InstallationGuide from '~components/installation/InstallationGuide';
import JoinProject from '~components/project/JoinProject';

export default function Landing() {
  const isStandalone = isRunningStandalone();
  const isSplashVisible = useSplashScreen();

  return (
    <>
      <Head>
        <title>Invis</title>
      </Head>

      <AnimatePresence initial={false}>
        {isSplashVisible ? (
          <SplashScreen />
        ) : isStandalone ? (
          // NOTE: keys are needed for the AnimatePresence component to work
          <Main key="join-project">
            <JoinProject />
          </Main>
        ) : (
          <Main key="installation-guide">
            <InstallationGuide />
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
  const { project } = req.cookies;

  console.log('> Index project', project);

  return {
    props: {},
    redirect: project
      ? { destination: '/app/home', permanent: false }
      : undefined,
  };
};
