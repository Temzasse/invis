import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import type { ReactNode } from "react";
import { json } from "@remix-run/node";

import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";

import { useClientStyleSheet } from "./styles/stitches.context";
import { globalStyles } from "./styles/stitches.config";
import { getUser } from "./session.server";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Mökkilista",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  return json({ user: await getUser(request) });
}

function Document({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const sheet = useClientStyleSheet();

  globalStyles();

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
