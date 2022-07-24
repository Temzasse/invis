import '../app/styles/globals.css';
import type { ReactNode } from 'react';
import type { AppProps } from 'next/app';

import TabsLayout from '~components/navigation/TabsLayout';
import ApiProvider from '~components/ApiProvider';
import { styled } from '~styled';

export default function App({ Component, pageProps, router }: AppProps) {
  const prefix = router.pathname.split('/')[1];
  const Layout = prefix === 'app' ? TabsLayout : FallbackLayout;

  return (
    <ApiProvider>
      <AppWrapper>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppWrapper>
    </ApiProvider>
  );
}

function FallbackLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

const AppWrapper = styled('div', {
  maxWidth: 800,
  margin: '0 auto',
  height: '100%',
});
