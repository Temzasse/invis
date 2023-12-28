import Head from 'next/head';
import { AnimatePresence, motion } from 'framer-motion';
import { InferGetServerSidePropsType } from 'next';
import { forwardRef, useCallback, useState } from 'react';

import { withApiSession } from '~/server/api/root';
import { Checkbox, EditableText, IconButton } from '~/components/uikit';
import { styled } from '~/styles/styled';
import { Navbar } from '~/components/navigation/Navbar';
import { useMounted } from '~/utils/common';

const randomId = () => Math.random().toString(36).substring(7);

export const getServerSideProps = withApiSession(async ({ req }, api) => {
  const shoplist = Array.from({ length: 10 }, (_, i) => ({
    id: randomId(),
    name: `Item ${i + 1}`,
    checked: false,
  }));

  return {
    shoplist,
  };
});

export default function Shoplist({
  shoplist: initialShoplist,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [shoplist, setShoplist] = useState(initialShoplist);
  const mounted = useMounted();

  const updateName = useCallback((id: string, name: string) => {
    setShoplist((prev) => {
      const newList = [...prev];
      const index = newList.findIndex((i) => i.id === id);
      newList[index].name = name;
      return newList;
    });
  }, []);

  const updateChecked = useCallback((id: string, checked: boolean) => {
    setShoplist((prev) => {
      const newList = [...prev];
      const index = newList.findIndex((i) => i.id === id);
      newList[index].checked = checked;
      return newList;
    });
  }, []);

  const addItem = useCallback(() => {
    setShoplist((prev) => [
      ...prev,
      {
        id: randomId(),
        name: '',
        checked: false,
      },
    ]);
  }, []);

  const completeShoplist = useCallback(() => {
    console.log('complete');
  }, []);

  const removeItem = useCallback((id: string) => {
    setShoplist((prev) => prev.filter((i) => i.id !== id));
  }, []);

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
          {shoplist.map((item) => (
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
            onPress={addItem}
          />
        </AddButtonWrapper>
      </List>
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
const ShopListItem = forwardRef<any, ShopListItemProps>(function ShopListItem(
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
          defaultChecked={checked}
          onChange={(event) => onCheckChange(id, event.currentTarget.checked)}
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
});

const List = styled('ol', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$regular',
  listStyle: 'none',
  paddingVertical: '$regular',
  paddingHorizontal: '$medium',
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
