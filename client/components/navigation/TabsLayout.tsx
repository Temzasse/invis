import { type ReactNode } from 'react';
import Link from 'next/link';

import { type IconName } from '../uikit/Icon';
import { useActiveTab, useTabStacks } from './hooks';
import { Icon, Stack, Text } from '~components/uikit';
import { styled } from '~styles/styled';
import { TabId } from './types';

const tabs: Array<{
  label: string;
  iconInactive: IconName;
  iconActive: IconName;
  to: string;
  id: TabId;
}> = [
  {
    id: 'home',
    to: '/app/home',
    label: 'Invis',
    iconInactive: 'homeOutline',
    iconActive: 'homeFilled',
  },
  {
    id: 'categories',
    to: '/app/categories',
    label: 'Kategoriat',
    iconInactive: 'gridOutline',
    iconActive: 'gridFilled',
  },
  {
    id: 'shoplist',
    to: '/app/shoplist',
    label: 'Kauppalista',
    iconInactive: 'clipboardOutline',
    iconActive: 'clipboardFilled',
  },
  {
    id: 'settings',
    to: '/app/settings',
    label: 'Asetukset',
    iconInactive: 'settingsOutline',
    iconActive: 'settingsFilled',
  },
];

type Props = {
  children: ReactNode;
};

export default function TabsNavigator({ children }: Props) {
  const activeTab = useActiveTab();
  const stacks = useTabStacks();

  return (
    <Wrapper>
      {children}

      <Tabbar>
        <TabbarContent activeTab={activeTab}>
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            const stack = stacks[tab.id];
            const href = isActive ? tab.to : stack[stack.length - 1] || tab.to;

            return (
              <TabLink href={href} passHref key={tab.to}>
                <Stack spacing="xsmall" align="center">
                  <TabIcon
                    name={isActive ? tab.iconActive : tab.iconInactive}
                    color={isActive ? 'primary' : 'text'}
                    isActive={isActive}
                  />
                  <Text
                    variant="bodySmall"
                    color={isActive ? 'text' : 'textMuted'}
                  >
                    {tab.label}
                  </Text>
                </Stack>
              </TabLink>
            );
          })}
        </TabbarContent>
      </Tabbar>
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  minViewportHeight: 100,
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: 'calc(60px + env(safe-area-inset-bottom))',
});

const Tabbar = styled('div', {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: '$background',
  zIndex: 1,
});

const TabbarContent = styled('div', {
  $$borderGlowColor: '$colors$primary',
  height: 60,
  maxWidth: 800,
  margin: '0 auto',
  paddingHorizontal: '$regular',
  marginBottom: 'env(safe-area-inset-bottom)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  borderTop: '1px solid',
  variants: {
    activeTab: {
      home: {
        borderImage:
          'linear-gradient(to right, $border, $$borderGlowColor 13%, $border 25%, $border 100%) 1',
      },
      categories: {
        borderImage:
          'linear-gradient(to right, $border, $border 15%, $$borderGlowColor 33%, $border 50%, $border 100%) 1',
      },
      shoplist: {
        borderImage:
          'linear-gradient(to right, $border, $border 40%, $$borderGlowColor 55%, $border 80%, $border 100%) 1',
      },
      settings: {
        borderImage:
          'linear-gradient(to right, $border, $border 65%, $$borderGlowColor 85%, $border 100%) 1',
      },
    },
  },
});

const TabLink = styled(Link, {
  paddingHorizontal: '$small',
});

const TabIcon = styled(Icon, {
  variants: {
    isActive: {
      true: {
        filter: 'drop-shadow(0px 6px 16px $colors$primary)',
        backgroundColor: 'transparent',
      },
    },
  },
});
