import Link from 'next/link';

import { styled } from '~styles/styled';
import { Icon, Stack, Text, Touchable } from '~components/uikit';

export default function LinkList({
  items,
}: {
  items: { id: string; href: string; label: string }[];
}) {
  return (
    <List>
      {items.map(({ id, href, label }) => (
        <Item key={id} id={id}>
          <Link href={href} passHref legacyBehavior>
            <ItemLink asLink interaction="highlight">
              <ItemStack
                direction="x"
                spacing="none"
                align="center"
                justify="between"
              >
                <Text variant="body">{label}</Text>
                <Icon name="chevronRight" size={16} color="textMuted" />
              </ItemStack>
            </ItemLink>
          </Link>
        </Item>
      ))}
    </List>
  );
}

const List = styled('ul', {
  display: 'flex',
  flexDirection: 'column',
});

const Item = styled('li', {
  transition: 'background-color 0.2s ease',

  '&[data-highlighted="true"]': {
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
  },
});

const ItemStack = styled(Stack, {
  padding: '$regular',
  paddingLeft: '0px',
  textDecoration: 'none',
  borderBottom: '1px solid',
  borderColor: '$border',
});

const ItemLink = styled(Touchable, {
  display: 'block',
  paddingLeft: '$regular',
});
