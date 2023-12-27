import { type InferGetServerSidePropsType } from 'next';
import { Fragment, useState } from 'react';
import Head from 'next/head';

import {
  getServerViewSettings,
  HOME_SORT_OPTIONS,
  useViewSettings,
} from '~/stores/view-settings';

import {
  Stack,
  SegmentedControl,
  Spacer,
  Text,
  IconButton,
  Spinner,
} from '~/components/uikit';

import { type ItemStatus } from '~/components/project/ItemStatus';
import { api } from '~/utils/api';
import { withApiSession } from '~/server/api/root';
import { useItemSections } from '~/utils/item-sections';
import { styled } from '~/styles/styled';
import { useItemStatusEditing } from '~/stores/item-status-editing';
import { useItemStatusMutations } from '~/client/hooks/item-status-mutations';
import { Navbar, NAVBAR_HEIGHT } from '~/components/navigation/Navbar';
import { ItemRow } from '~/components/project/ItemRow';
import { CreateItemSheet } from '~/components/project/CreateItemSheet';

export const getServerSideProps = withApiSession(async ({ req }, api) => {
  await api.category.getCategoriesWithItems.prefetch();
  return { initialViewSettings: getServerViewSettings(req.cookies) };
});

export default function Home({
  initialViewSettings,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: categories = [] } = api.category.getCategoriesWithItems.useQuery(); // prettier-ignore
  const viewSettings = useViewSettings(initialViewSettings);
  const editing = useItemStatusEditing();
  const mutations = useItemStatusMutations(categories);

  const sections = useItemSections({
    sortOrder: viewSettings.homeSortOrder,
    searchTerm,
    categories,
  });

  function handleEditChange(id: string, newStatus: ItemStatus) {
    if (editing.isMulti) {
      mutations.onMultiEditChange(id, newStatus);
    } else {
      mutations.onSingleEditChange(id, newStatus);
      editing.toggleItemEditable(id);
    }
  }

  function handleMultiEditEnd() {
    mutations.onMultiEditingEnd();
    editing.clear();
  }

  return (
    <>
      <Head>
        <title>Invis</title>
      </Head>

      <Navbar
        title="Invis"
        search={{ value: searchTerm, onChange: setSearchTerm }}
        leftSlot={
          <IconButton icon="plus" onPress={() => setIsCreating(true)} />
        }
        rightSlot={
          editing.isMulti ? (
            mutations.isLoading ? (
              <Spinner />
            ) : (
              <IconButton icon="check" onPress={handleMultiEditEnd} />
            )
          ) : (
            <IconButton
              icon="pencil"
              onPress={() => editing.setIsMulti(true)}
            />
          )
        }
      />

      <ViewSorting>
        <SegmentedControl
          segments={HOME_SORT_OPTIONS}
          selected={viewSettings.homeSortOrder}
          onSelect={viewSettings.setHomeSortOrder}
        />
      </ViewSorting>

      <Spacer direction="y" amount="small" />

      <Sections>
        <Stack direction="y" spacing="none">
          {sections.map(({ title, items }) => (
            <Fragment key={title}>
              <SectionTitle variant="overline" color="textMuted">
                {title}
              </SectionTitle>

              {items.map(({ id, name, status }) => (
                <ItemRow
                  key={id}
                  id={id}
                  status={mutations.editedStatuses[id] || status}
                  name={name}
                  isEditable={editing.isMulti || editing.editable.has(id)}
                  onEditStart={() => editing.toggleItemEditable(id)}
                  onEditChange={(newStatus) => handleEditChange(id, newStatus)}
                />
              ))}
            </Fragment>
          ))}

          {searchTerm && sections.length === 0 && (
            <NoSearchResults>
              <Text variant="body">Ei tuloksia</Text>
            </NoSearchResults>
          )}
        </Stack>
      </Sections>

      <CreateItemSheet
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
      />
    </>
  );
}

const ViewSorting = styled('div', {
  paddingHorizontal: '$small',
});

const SectionTitle = styled(Text, {
  display: 'block',
  zIndex: 1,
  position: 'sticky',
  top: NAVBAR_HEIGHT,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(10px)',
  paddingVertical: '$xsmall',
  paddingHorizontal: '$regular',
});

const Sections = styled('div', {
  minHeight: '100vh',
});

const NoSearchResults = styled('div', {
  padding: '$large',
  flexCenter: true,
});
