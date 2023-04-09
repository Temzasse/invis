import { ReactNode } from 'react';
import { SWRConfig, BareFetcher } from 'swr';

type Props = {
  children: ReactNode;
};

const fetcher: BareFetcher = async (resource, init) => {
  const res = await fetch(resource, init);
  return await res.json();
};

// TODO: do we need background refreshing?
const refreshInterval = 20000; // 20sec

export default function ApiProvider({ children }: Props) {
  return <SWRConfig value={{ fetcher, refreshInterval }}>{children}</SWRConfig>;
}
