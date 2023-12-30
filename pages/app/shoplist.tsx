import Head from 'next/head';
import { forwardRef, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import {
  useAddShoplistItem,
  useRemoveShoplistItem,
  useUpdateShoplistItem,
} from '~/client/hooks/shoplist-mutations';

import { api } from '~/utils/api';
import { withApiSession } from '~/server/api/root';
import { styled } from '~/styles/styled';
import { useMounted } from '~/utils/common';
import { Navbar } from '~/components/navigation/Navbar';
import { Checkbox, EditableText, IconButton } from '~/components/uikit';
import { ShoplistSubscription } from '~/components/shoplist/ShoplistSubscription';

export const getServerSideProps = withApiSession(async ({ req }, api) => {
  await api.shoplist.getCurrentShoplist.prefetch();
});

export default function Shoplist() {
  const mounted = useMounted();

  // TODO: add refetch polling or subscribe to shoplist updates
  const { data: shoplist } = api.shoplist.getCurrentShoplist.useQuery();
  const { updateChecked, updateName } = useUpdateShoplistItem();
  const { addItem } = useAddShoplistItem();
  const { removeItem } = useRemoveShoplistItem();

  if (!shoplist) return null;

  const completeShoplist = () => console.log('complete');

  return (
    <>
      <Head>
        <title>Ostoslista</title>
      </Head>

      <Navbar
        title="Kauppalista"
        rightSlot={<IconButton icon="check" onPress={completeShoplist} />}
      />

      <List>
        <AnimatePresence mode="popLayout" initial={false}>
          {shoplist.items.map((item) => (
            <ShopListItem
              key={item.id}
              id={item.id}
              name={item.name}
              checked={item.checked}
              canAutoFocus={mounted}
              onCheckChange={updateChecked}
              onNameChange={updateName}
              onRemove={removeItem}
            />
          ))}
        </AnimatePresence>

        <AddButtonWrapper layout="position">
          <IconButton
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

type ShopListItemProps = {
  id: string;
  name: string;
  checked: boolean;
  canAutoFocus: boolean;
  onCheckChange: (id: string, checked: boolean) => void;
  onNameChange: (id: string, name: string) => void;
  onRemove: (id: string) => void;
};

// NOTE: AnimatePresence passes a ref to the component, so we need to forward it
const ShopListItem = memo(
  forwardRef<any, ShopListItemProps>(function ShopListItem(
    { id, name, checked, canAutoFocus, onCheckChange, onNameChange, onRemove },
    ref
  ) {
    return (
      <ListItem
        ref={ref}
        layout="position"
        initial={{ opacity: 1, height: 0, overflow: 'hidden' }}
        animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
        exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
      >
        <ListItemContent>
          <Checkbox
            checked={checked}
            onChange={(event) => {
              // Item needs to have a name before it can be checked
              if (name) {
                onCheckChange(id, event.currentTarget.checked);
              }
            }}
          />
          <EditableText
            onEditDone={(value) => onNameChange(id, value)}
            initialFocused={canAutoFocus}
          >
            {name}
          </EditableText>
        </ListItemContent>

        <RemoveButtonWrapper>
          <IconButton
            icon="minusOutline"
            size={20}
            color="textMuted"
            onPress={() => onRemove(id)}
          />
        </RemoveButtonWrapper>
      </ListItem>
    );
  })
);

const List = styled('ol', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$regular',
  listStyle: 'none',
  paddingVertical: '$regular',
  paddingHorizontal: '$medium',
  scrollPaddingBlock: '200px',
});

const ListItem = styled(motion.li, {
  display: 'flex',
});

const ListItemContent = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$regular',
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});

const AddButtonWrapper = styled(motion.div, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const RemoveButtonWrapper = styled('div', {
  // Offset a bit to align with navbar right slot icon
  marginRight: '-$xxsmall',
});
