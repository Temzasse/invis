import { type InferGetServerSidePropsType } from 'next';
import { Fragment, useState } from 'react';
import Head from 'next/head';

import {
  getServerViewSettings,
  HOME_SORT_OPTIONS,
  useViewSettings,
} from '~stores/view-settings';

import {
  Stack,
  SegmentedControl,
  Spacer,
  Text,
  IconButton,
} from '~components/uikit';

import { type RouterOutputs, api } from '~utils/api';
import { type ItemStatus } from '~components/project/ItemStatus';
import { withProject } from '~server/utils/redirect';
import { useItemSections } from '~utils/items';
import { styled } from '~styles/styled';
import Navbar, { NAVBAR_HEIGHT } from '~components/navigation/Navbar';
import ItemRow from '~components/project/ItemRow';

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;
export default function Home({ initialViewSettings }: Props) {
  const { data: categories = [] } =
    api.category.getCategoriesWithItems.useQuery();
  const viewSettings = useViewSettings(initialViewSettings);
  const sections = useItemSections(viewSettings.homeSortOrder, categories);
  const [isEditing, setEditing] = useState(false);
  const [statuses, setStatuses] = useState(() => getStatusMap(categories));

  function handleEditingStart() {
    setEditing(true);
  }

  function handleEditingEnd() {
    setEditing(false);
  }

  function handleEditChange(id: string, newStatus: ItemStatus) {
    setStatuses((prev) => ({ ...prev, [id]: newStatus }));
  }

  return (
    <>
      <Head>
        <title>Invis</title>
      </Head>

      <Navbar
        title="Invis"
        rightSlot={
          isEditing ? (
            <IconButton icon="check" onPress={handleEditingEnd} />
          ) : (
            <IconButton icon="pencil" onPress={handleEditingStart} />
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

      <Stack direction="y" spacing="none">
        {Object.entries(sections).map(([title, items]) => (
          <Fragment key={title}>
            <SectionTitle variant="overline" color="textMuted">
              {title}
            </SectionTitle>
            {items.map(({ id, name }) => (
              <ItemRow
                key={id}
                status={statuses[id]}
                name={name}
                isEditable={isEditing}
                onEdit={(newStatus) => handleEditChange(id, newStatus)}
              />
            ))}
          </Fragment>
        ))}
      </Stack>
    </>
  );
}

export const getServerSideProps = withProject(async ({ req }) => {
  const initialViewSettings = getServerViewSettings(req.cookies);

  return {
    props: {
      initialViewSettings,
    },
  };
});

function getStatusMap(
  categories: RouterOutputs['category']['getCategoriesWithItems']
) {
  const statuses: Record<string, ItemStatus> = {};

  categories.forEach(({ items }) => {
    items.forEach((item) => {
      statuses[item.id] = item.status as ItemStatus;
    });
  });

  return statuses;
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
