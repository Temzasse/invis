import type { PrecacheEntry } from '@serwist/precaching';
import { defaultCache } from '@serwist/next/browser';
import { installSerwist } from '@serwist/sw';

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

installSerwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});
