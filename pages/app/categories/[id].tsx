import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { RouterOutputs, api } from '~/utils/api';
import { withApiSession } from '~/server/api/root';
import { useItemStatusMutations } from '~/client/hooks/item-status-mutations';
import { useItemStatusEditing } from '~/stores/item-status-editing';
import { ItemStatus } from '~/components/project/ItemStatus';
import { styled } from '~/styles/styled';
import { IconButton, Text } from '~/components/uikit';
import { Navbar } from '~/components/navigation/Navbar';
import { ItemRow } from '~/components/project/ItemRow';
import { CreateItemSheet } from '~/components/project/CreateItemSheet';

export const getServerSideProps = withApiSession(async ({ params }, api) => {
  await api.category.getCategory.prefetch({ id: params?.id as string });
});

type Category = NonNullable<RouterOutputs['category']['getCategory']>;

export default function Category() {
  const { query } = useRouter();
  const [isCreating, setIsCreating] = useState(false);
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

      <Navbar
        title={category.name}
        rightSlot={
          <IconButton icon="plus" onPress={() => setIsCreating(true)} />
        }
      />

      <Content>
        <CategoryItems category={category} />
      </Content>

      <CreateItemSheet
        isOpen={isCreating}
        categoryId={category.id}
        onClose={() => setIsCreating(false)}
      />
    </>
  );
}

function CategoryItems({ category }: { category: Category }) {
  const mutations = useItemStatusMutations([category]);
  const editing = useItemStatusEditing();

  function handleEditChange(id: string, newStatus: ItemStatus) {
    mutations.onSingleEditChange(id, newStatus);
    editing.toggleItemEditable(id);
  }

  return (
    <>
      {category.items.map(({ id, name, status }) => (
        <ItemRow
          key={id}
          id={id}
          status={mutations.editedStatuses[id] || status}
          name={name}
          isEditable={editing.editable.has(id)}
          onEditStart={() => editing.toggleItemEditable(id)}
          onEditChange={(newStatus) => handleEditChange(id, newStatus)}
        />
      ))}
    </>
  );
}

const Content = styled('div', {
  paddingBottom: '$large',
});
