import type { GetServerSideProps } from 'next';
import type { Project } from '@prisma/client';
import Head from 'next/head';
import Link from 'next/link';

import { ensureProject } from '~api/project/service';
import { styled } from '~styles/styled';
import { Button } from '~components/uikit';
import Navbar from '~components/navigation/Navbar';

type ServerSideProps = {
  project: Project;
};

type Props = {
  project: ServerSideProps['project'];
};

export default function Settings({ project }: Props) {
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { project, redirect } = await ensureProject(req);

  if (!project) return redirect;

  const props: ServerSideProps = { project };

  return { props };
};
