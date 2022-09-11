import type { GetServerSideProps } from 'next';
import { Fragment } from 'react';
import Head from 'next/head';

import {
  getServerViewSettings,
  HOME_SORT_OPTIONS,
  useViewSettings,
} from '~app/stores/view-settings';

import {
  ensureProject,
  getProjectCategoriesWithItems,
} from '~api/project/service';

import type { ItemStatus } from '~components/project/ItemStatus';
import { useItemSections } from '~app/utils/items';
import { styled } from '~styles/styled';
import { Stack, SegmentedControl, Spacer, Text } from '~app/components/uikit';
import Navbar, { NAVBAR_HEIGHT } from '~app/components/navigation/Navbar';
import ItemRow from '~components/project/ItemRow';

type Props = {
  categories: Awaited<ReturnType<typeof getProjectCategoriesWithItems>>;
  initialViewSettings: ReturnType<typeof getServerViewSettings>;
};

export default function Home({ initialViewSettings, categories }: Props) {
  const viewSettings = useViewSettings(initialViewSettings);
  const sections = useItemSections(viewSettings.homeSortOrder, categories);

  return (
    <>
      <Head>
        <title>Invis</title>
      </Head>

      <Navbar title="Invis" />

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
            {items.map(({ id, name, status }) => (
              <ItemRow key={id} status={status as ItemStatus} name={name} />
            ))}
          </Fragment>
        ))}
      </Stack>
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { project, redirect } = await ensureProject(req);

  if (!project) return redirect;

  const categories = await getProjectCategoriesWithItems({
    name: project.name,
    pin: project.pin,
  });

  const initialViewSettings = getServerViewSettings(req.cookies);

  const props: Props = {
    categories,
    initialViewSettings,
  };

  return { props };
};
