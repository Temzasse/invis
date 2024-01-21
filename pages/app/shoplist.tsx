import Head from 'next/head';
import { AnimatePresence, motion } from 'framer-motion';

import {
  useAddShoplistItem,
  useCompleteShoplist,
  useRemoveShoplistItem,
  useUpdateShoplistItem,
} from '~/client/hooks/shoplist-mutations';

import { api } from '~/utils/api';
import { withApiSession } from '~/server/api/root';
import { styled } from '~/styles/styled';
import { Navbar } from '~/components/navigation/Navbar';
import { IconButton, Spinner } from '~/components/uikit';
import { ShoplistSubscription } from '~/components/shoplist/ShoplistSubscription';
import { ShopListItem } from '~/components/shoplist/ShoplistItem';

export const getServerSideProps = withApiSession(async ({ req }, api) => {
  await api.shoplist.getCurrentShoplist.prefetch();
});

export default function Shoplist() {
  const { data: shoplist } = api.shoplist.getCurrentShoplist.useQuery();
  const { updateChecked, updateName } = useUpdateShoplistItem();
  const { addItem, isAdding } = useAddShoplistItem();
  const { completeShoplist, isCompleting } = useCompleteShoplist();
  const { removeItem } = useRemoveShoplistItem();

  if (!shoplist) return null;

  let navbarRightSlot = null;

  if (isCompleting) {
    navbarRightSlot = <Spinner style={{ margin: 10 }} />;
  } else if (!shoplist.completed && shoplist.items.length > 0) {
    navbarRightSlot = (
      <IconButton icon="check" onPress={() => completeShoplist(shoplist.id)} />
    );
  }

  return (
    <>
      <Head>
        <title>Ostoslista</title>
      </Head>

      <Navbar title="Kauppalista" rightSlot={navbarRightSlot} />

      <List>
        <AnimatePresence mode="popLayout" initial={false}>
          {shoplist.items.map((item) => (
            <ShopListItem
              key={item.id}
              id={item.id}
              name={item.name}
              checked={item.checked || shoplist.completed}
              onCheckChange={updateChecked}
              onNameChange={updateName}
              onRemove={removeItem}
            />
          ))}
        </AnimatePresence>

        <AddButtonWrapper layout="position">
          <IconButton
            disabled={isAdding}
            icon="plusCircleFilled"
            color="primary"
            size={32}
            onPress={() => addItem(shoplist.id)}
          />
        </AddButtonWrapper>
      </List>

      <ShoplistSubscription shoplistId={shoplist.id} />
    </>
  );
}

const List = styled('ol', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$regular',
  listStyle: 'none',
  paddingVertical: '$regular',
  paddingHorizontal: '$medium',
  scrollPaddingBlock: '200px',
});

const AddButtonWrapper = styled(motion.div, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
