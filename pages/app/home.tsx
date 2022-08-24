import type { GetServerSideProps } from 'next';
import Head from 'next/head';

import {
  getServerViewSettings,
  HOME_SORT_OPTIONS,
  useViewSettings,
  ViewSettingsState,
} from '~app/stores/view-settings';

import { styled } from '~styles/styled';
import { Stack, SegmentedControl, Spacer } from 'app/components/uikit';
import Navbar from 'app/components/navigation/Navbar';
import ItemRow from '~components/project/ItemRow';

const items = Array.from({ length: 30 }).map((_, i) => ({
  id: i.toString(),
  name: `Item ${i}`,
  status: 'missing' as any,
}));

type Props = {
  initialViewSettings: ViewSettingsState;
};

export default function Home({ initialViewSettings }: Props) {
  const viewSettings = useViewSettings(initialViewSettings);

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
        {items.map(({ id, name, status }) => (
          <ItemRow key={id} status={status} name={name} />
        ))}
      </Stack>
    </>
  );
}

const ViewSorting = styled('div', {
  paddingHorizontal: '$small',
});

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return {
    props: { initialViewSettings: getServerViewSettings(req) },
  };
};
