import Head from 'next/head';
import { InferGetServerSidePropsType } from 'next';
import { useCallback, useState } from 'react';

import { withApiSession } from '~/server/api/root';
import { Checkbox, EditableText } from '~/components/uikit';
import { styled } from '~/styles/styled';
import { Navbar } from '~/components/navigation/Navbar';

type ShoplistItem = {
  id: string;
  name: string;
  checked: boolean;
};

export const getServerSideProps = withApiSession(async ({ req }, api) => {
  const shoplist: ShoplistItem[] = Array.from({ length: 10 }, (_, i) => ({
    id: `id-${i + 1}`,
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

  return (
    <>
      <Head>
        <title>Ostoslista</title>
      </Head>

      <Navbar title="Ostoslista" />

      <List>
        {shoplist.map((item) => (
          <ListItem
            key={item.id}
            id={item.id}
            name={item.name}
            checked={item.checked}
            onCheckChange={updateChecked}
            onNameChange={updateName}
          />
        ))}
      </List>
    </>
  );
}

function ListItem({
  id,
  name,
  checked,
  onCheckChange,
  onNameChange,
}: {
  id: string;
  name: string;
  checked: boolean;
  onCheckChange: (id: string, checked: boolean) => void;
  onNameChange: (id: string, name: string) => void;
}) {
  return (
    <li>
      <Label>
        <Checkbox
          defaultChecked={checked}
          onChange={(event) => onCheckChange(id, event.currentTarget.checked)}
        />
        <EditableText onEditDone={(value) => onNameChange(id, value)}>
          {name}
        </EditableText>
      </Label>
    </li>
  );
}

const List = styled('ol', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$regular',
  listStyle: 'none',
  paddingVertical: '$regular',
  paddingHorizontal: '$medium',
});

const Label = styled('label', {
  display: 'flex',
  alignItems: 'center',
  gap: '$regular',
});
