import type { GetServerSideProps } from 'next';
import Head from 'next/head';

import { ensureProject, getProjectCategories } from '~api/project/service';
import { styled } from '~styles/styled';
import { Text } from '~app/components/uikit';
import Navbar from '~app/components/navigation/Navbar';

type Props = {
  categories: Awaited<ReturnType<typeof getProjectCategories>>;
};

export default function Categories({ categories }: Props) {
  console.log('> categories', categories);
  return (
    <>
      <Head>
        <title>Kategoriat</title>
      </Head>

      <Navbar title="Kategoriat" />

      <Content>
        <CategoriesGrid>
          {categories.map(({ id, name, imageUrl }) => (
            <Category
              key={id}
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1)), url(${imageUrl})`,
              }}
            >
              <CategoryName variant="title2" align="center">
                {name}
              </CategoryName>
            </Category>
          ))}
        </CategoriesGrid>
      </Content>
    </>
  );
}

const Content = styled('div', {
  paddingHorizontal: '$regular',
});

const CategoriesGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gridGap: '$regular',
});

const Category = styled('div', {
  aspectRatio: '16 / 9',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: '$regular',
  flexCenter: 'row',
  padding: '$small',
});

const CategoryName = styled(Text, {
  textShadow: '0 0 8px rgba(0, 0, 0, 0.6)',
});

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { project, redirect } = await ensureProject(req);

  if (!project) return redirect;

  const categories = await getProjectCategories({
    name: project.name,
    pin: project.pin,
  });

  const props: Props = {
    categories,
  };

  return { props };
};
