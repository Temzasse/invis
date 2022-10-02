import type { InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

import { getCategory } from '~api/category/service';
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
  const category = await getCategory({ id: query.id as string });
  return { props: { category } };
});
