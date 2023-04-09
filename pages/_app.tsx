import '../client/styles/globals.css';
import { type ReactNode } from 'react';
import { type AppProps } from 'next/app';

import TabsLayout from '~components/navigation/TabsLayout';
import { styled } from '~styles/styled';
import { api } from '~utils/api';

function App({ Component, pageProps, router }: AppProps) {
  const prefix = router.pathname.split('/')[1];
  const Layout = prefix === 'app' ? TabsLayout : FallbackLayout;

  return (
    <AppWrapper>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppWrapper>
  );
}

function FallbackLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

const AppWrapper = styled('div', {
  maxWidth: 800,
  marginLeft: 'auto',
  marginRight: 'auto',
  height: '100%',
});

export default api.withTRPC(App);
