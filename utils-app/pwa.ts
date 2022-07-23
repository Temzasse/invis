import { isBrowser } from './common';

export function isRunningStandalone() {
  return isBrowser()
    ? window.matchMedia('(display-mode: standalone)').matches
    : false;
}
