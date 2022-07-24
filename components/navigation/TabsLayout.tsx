import type { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import type { IconName } from '../uikit/Icon';
import { Icon, Stack, Text } from '../uikit';
import { styled } from '~styles/styled';

type Props = {
  children: ReactNode;
};

export default function TabsNavigator({ children }: Props) {
  const { pathname } = useRouter();
  const activeTab = pathname.split('/')[2];

  return (
    <Wrapper>
      {children}

      <Tabbar>
        <TabbarContent>
          {tabs.map((tab) => {
            const tabId = tab.to.split('/')[2];
            const isActive = tabId === activeTab;

            return (
              <Link href={tab.to} passHref key={tab.to}>
                <TabLink>
                  <Stack spacing="xxsmall" align="center">
                    <Icon
                      name={isActive ? tab.iconActive : tab.iconInactive}
                      color={isActive ? 'primary' : 'text'}
                    />
                    <Text
                      variant="bodySmall"
                      color={isActive ? 'text' : 'textMuted'}
                    >
                      {tab.label}
                    </Text>
                  </Stack>
                </TabLink>
              </Link>
            );
          })}
        </TabbarContent>
      </Tabbar>
    </Wrapper>
  );
}

const tabs: Array<{
  label: string;
  iconInactive: IconName;
  iconActive: IconName;
  to: string;
}> = [
  {
    label: 'Invis',
    iconInactive: 'homeOutline',
    iconActive: 'homeFilled',
    to: '/app/home',
  },
  {
    label: 'Kategoriat',
    iconInactive: 'gridOutline',
    iconActive: 'gridFilled',
    to: '/app/categories',
  },
  {
    label: 'Kauppalista',
    iconInactive: 'clipboardOutline',
    iconActive: 'clipboardFilled',
    to: '/app/shoplist',
  },
  {
    label: 'Asetukset',
    iconInactive: 'settingsOutline',
    iconActive: 'settingsFilled',
    to: '/app/settings',
  },
];

const Wrapper = styled('div', {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: 100,
});

const Tabbar = styled('div', {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: '$background',
});

const TabbarContent = styled('div', {
  maxWidth: 800,
  margin: '0 auto',
  paddingTop: '$xsmall',
  paddingBottom: 'max($xsmall, env(safe-area-inset-bottom))',
  paddingHorizontal: '$regular',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  borderTop: '1px solid',
  borderColor: '$border',
});

const TabLink = styled('a', {
  paddingHorizontal: '$small',
});
