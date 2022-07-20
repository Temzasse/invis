import type { LinksFunction, LoaderArgs, MetaFunction } from '@remix-run/node';
import type { ReactNode } from 'react';
import { json } from '@remix-run/node';

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from '@remix-run/react';

import globalStyles from './styles/global.css';
import { useClientStyleSheet } from './styles/stitches.context';
import { getUser } from './session.server';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: globalStyles }];
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Mökkilista',
  description: 'Kaikki mitä mökille tarvitaan',
  viewport: 'width=device-width,initial-scale=1,viewport-fit=cover',
  'theme-color': '#ffffff',
  'apple-mobile-web-app-title': 'Mökkilista',
  'application-name': 'Mökkilista',
  'apple-mobile-web-app-capable': 'yes',
  'apple-mobile-web-app-status-bar-style': 'black-translucent',
});

export async function loader({ request }: LoaderArgs) {
  return json({ user: await getUser(request) });
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  const message = `${caught.status} ${caught.statusText}`;

  return (
    <Document title={message}>
      <p>[CatchBoundary]: {message}</p>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error!">
      <p>[ErrorBoundary]: There was an error: {error.message}</p>
    </Document>
  );
}

function Document({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const sheet = useClientStyleSheet();

  return (
    <html lang="en">
      <head>
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
        <style
          id="stitches"
          dangerouslySetInnerHTML={{ __html: sheet }}
          suppressHydrationWarning
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
