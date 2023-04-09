import Head from 'next/head';

import { styled } from '~styles/styled';
import { Text } from '~components/uikit';
import Navbar from '~components/navigation/Navbar';
import { api } from '~app/utils/api';
import { useRouter } from 'next/router';

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
