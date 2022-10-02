import type { GetServerSideProps } from 'next';
import Head from 'next/head';

import { ensureProject } from '~api/project/service';
import { styled } from '~styles/styled';
import { Text } from '~app/components/uikit';
import Navbar from '~app/components/navigation/Navbar';
import { getCategory } from '~api/category/service';

type Props = {
  category: Awaited<ReturnType<typeof getCategory>>;
};

export default function Category({ category }: Props) {
  if (!category) {
    return <Text variant="body">Kategoriaa ei löytynyt</Text>;
  }

  return (
    <>
      <Head>
        <title>Kategoria</title>
      </Head>

      <Navbar title={category.name} />

      <Content>TODO</Content>
    </>
  );
}

const Content = styled('div', {
  paddingHorizontal: '$regular',
  paddingBottom: '$large',
});

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { project, redirect } = await ensureProject(req);

  if (!project) return redirect;

  const category = await getCategory({ id: query.id as string });
  const props: Props = { category };

  return { props };
};
