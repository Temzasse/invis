import type { InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

import { withProject } from '~api/utils/redirect';
import Navbar from '~app/components/navigation/Navbar';

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Shoplist({ project }: Props) {
  console.log(project);
  return (
    <>
      <Head>
        <title>Ostoslista</title>
      </Head>

      <Navbar title="Ostoslista" />
    </>
  );
}

export const getServerSideProps = withProject(async (_, project) => {
  return { props: { project } };
});
