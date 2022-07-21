import * as React from 'react';
import { hydrate } from 'react-dom';
import { RemixBrowser } from '@remix-run/react';
import { ClientStyleSheetProvider } from './styles/stitches.context';

hydrate(
  <React.StrictMode>
    <ClientStyleSheetProvider>
      <RemixBrowser />
    </ClientStyleSheetProvider>
  </React.StrictMode>,
  document
);
