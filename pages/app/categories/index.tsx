import Head from 'next/head';
import Link from 'next/link';

import { api } from '~utils/api';
import { withApiSession } from '~server/api/root';
import { styled } from '~styles/styled';
import { Text } from '~components/uikit';
import Navbar from '~components/navigation/Navbar';

export const getServerSideProps = withApiSession(async (_, api) => {
  await api.category.getCategories.prefetch();
});

export default function Categories() {
  const { data: categories = [] } = api.category.getCategories.useQuery();

  return (
    <>
      <Head>
        <title>Kategoriat</title>
      </Head>

      <Navbar title="Kategoriat" />

      <Content>
        <CategoriesGrid>
          {categories.map(({ id, name, imageUrl }) => (
            <CategoryLink
              key={id}
              href={`categories/${id}`}
              passHref
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1)), url(${imageUrl})`,
              }}
            >
              <CategoryName variant="title2" align="center">
                {name}
              </CategoryName>
            </CategoryLink>
          ))}
        </CategoriesGrid>
      </Content>
    </>
  );
}

const Content = styled('div', {
  paddingHorizontal: '$regular',
  paddingBottom: '$large',
});

const CategoriesGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridGap: '$regular',
});

const CategoryLink = styled(Link, {
  aspectRatio: '16 / 9',
  backgroundColor: '$surface2',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: '$regular',
  flexCenter: 'row',
  padding: '$small',
  textDecoration: 'none',
});

const CategoryName = styled(Text, {
  textShadow: '0 0 8px rgba(0, 0, 0, 0.6)',
});
