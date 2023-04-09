import Head from 'next/head';
import { useRouter } from 'next/router';

import { api } from '~utils/api';
import { withApiSession } from '~server/api/root';
import { styled } from '~styles/styled';
import { Text } from '~components/uikit';
import Navbar from '~components/navigation/Navbar';

export const getServerSideProps = withApiSession(async ({ params }, api) => {
  await api.category.getCategory.prefetch({ id: params?.id as string });
});

export default function Category() {
  const { query } = useRouter();
  const { data: category } = api.category.getCategory.useQuery({
    id: query.id as string,
  });

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
