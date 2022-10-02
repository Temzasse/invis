import type { InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

import { withProject } from '~api/utils/redirect';
import { getProjectCategories } from '~api/project/service';
import { styled } from '~styles/styled';
import { Text } from '~app/components/uikit';
import Navbar from '~app/components/navigation/Navbar';
import Link from 'next/link';

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Categories({ categories }: Props) {
  return (
    <>
      <Head>
        <title>Kategoriat</title>
      </Head>

      <Navbar title="Kategoriat" />

      <Content>
        <CategoriesGrid>
          {categories.map(({ id, name, imageUrl }) => (
            <Link href={`categories/${id}`} passHref key={id}>
              <Category
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1)), url(${imageUrl})`,
                }}
              >
                <CategoryName variant="title2" align="center">
                  {name}
                </CategoryName>
              </Category>
            </Link>
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

const Category = styled('a', {
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

export const getServerSideProps = withProject(async (_, project) => {
  const categories = await getProjectCategories({
    name: project.name,
    pin: project.pin,
  });

  return { props: { categories } };
});
