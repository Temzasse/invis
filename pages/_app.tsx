import '../client/styles/globals.css';
import { type ReactNode } from 'react';
import { type AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';

import { TabsLayout } from '~/components/navigation/TabsLayout';
import { styled, css } from '~/styles/styled';
import { api } from '~/utils/api';

function App({ Component, pageProps, router }: AppProps) {
  const prefix = router.pathname.split('/')[1];
  const Layout = prefix === 'app' ? TabsLayout : FallbackLayout;

  return (
    <AppWrapper>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster
        containerClassName={toasterContainerStyles()}
        toastOptions={{ className: toastStyles() }}
      />
    </AppWrapper>
  );
}

function FallbackLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

const toasterContainerStyles = css({
  bottom: 'calc(72px + env(safe-area-inset-bottom)) !important',
  top: 'calc(8px + env(safe-area-inset-top)) !important',
});

const toastStyles = css({
  borderRadius: '$regular !important',
  backgroundColor: '$elevated !important',
  color: '$text !important',
  border: '1px solid rgba(150, 150, 150, 0.1)',
});

const AppWrapper = styled('div', {
  maxWidth: 800,
  marginLeft: 'auto',
  marginRight: 'auto',
  height: '100%',
});

export default api.withTRPC(App);
