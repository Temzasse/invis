import * as React from 'react';
import { RemixBrowser } from '@remix-run/react';
import { hydrateRoot } from 'react-dom/client';
import { ClientStyleSheetProvider } from './styles/stitches.context';

requestIdleCallback(() => {
  React.startTransition(() => {
    hydrateRoot(
      document,
      <React.StrictMode>
        <ClientStyleSheetProvider>
          <RemixBrowser />
        </ClientStyleSheetProvider>
      </React.StrictMode>
    );
  });
});
