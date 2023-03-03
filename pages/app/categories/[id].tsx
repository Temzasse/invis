import type { InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

import { findCategory } from '~api/category/dao';
import { withProject } from '~api/utils/redirect';
import { styled } from '~styles/styled';
import { Text } from '~app/components/uikit';
import Navbar from '~app/components/navigation/Navbar';

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

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

export const getServerSideProps = withProject(async ({ query }, project) => {
  const category = await findCategory({ id: query.id as string });
  return { props: { category } };
});
