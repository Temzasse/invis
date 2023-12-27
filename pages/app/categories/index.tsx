import { useState } from 'react';
import orderBy from 'lodash/orderBy';
import Head from 'next/head';

import { api } from '~utils/api';
import { withApiSession } from '~server/api/root';
import { styled } from '~styles/styled';
import { IconButton } from '~components/uikit';
import { Navbar } from '~components/navigation/Navbar';
import { LinkList } from '~components/navigation/LinkList';
import { CreateCategorySheet } from '~components/project/CreateCategorySheet';

export const getServerSideProps = withApiSession(async (_, api) => {
  await api.category.getCategories.prefetch();
});

export default function Categories() {
  const [isCreating, setIsCreating] = useState(false);
  const { data: categories = [] } = api.category.getCategories.useQuery();

  return (
    <>
      <Head>
        <title>Kategoriat</title>
      </Head>

      <Navbar
        title="Kategoriat"
        rightSlot={
          <IconButton icon="plus" onPress={() => setIsCreating(true)} />
        }
      />

      <Content>
        <LinkList
          items={orderBy(categories, 'name').map((c) => ({
            id: c.id,
            href: `categories/${c.id}`,
            label: c.name,
          }))}
        />
      </Content>

      <CreateCategorySheet
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
      />
    </>
  );
}

const Content = styled('div', {
  paddingBottom: '$large',
});
