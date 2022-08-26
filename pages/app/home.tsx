import type { GetServerSideProps } from 'next';
import Head from 'next/head';

import {
  getServerViewSettings,
  HOME_SORT_OPTIONS,
  useViewSettings,
} from '~app/stores/view-settings';

import type { ConvertDateFields } from '~app/types/data';
import type { ItemStatus } from '~components/project/ItemStatus';
import { styled } from '~styles/styled';
import { getProjectCategoriesWithItems } from '~api/project/service';
import { Stack, SegmentedControl, Spacer } from '~app/components/uikit';
import Navbar from '~app/components/navigation/Navbar';
import ItemRow from '~components/project/ItemRow';

type ServerSideProps = {
  categories: Awaited<ReturnType<typeof getProjectCategoriesWithItems>>;
  initialViewSettings: ReturnType<typeof getServerViewSettings>;
};

type Props = {
  categories: ConvertDateFields<ServerSideProps['categories']>;
  initialViewSettings: ServerSideProps['initialViewSettings'];
};

export default function Home({ initialViewSettings, categories }: Props) {
  const viewSettings = useViewSettings(initialViewSettings);
  const items = categories.flatMap((category) => category.items);

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
          <ItemRow key={id} status={status as ItemStatus} name={name} />
        ))}
      </Stack>
    </>
  );
}

const ViewSorting = styled('div', {
  paddingHorizontal: '$small',
});

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { project } = req.cookies;

  if (!project) {
    return { props: {}, redirect: { destination: '/', permanent: false } };
  }

  const categories = await getProjectCategoriesWithItems(req);
  const initialViewSettings = getServerViewSettings(req);
  const props: ServerSideProps = { categories, initialViewSettings };

  return { props };
};
