import { TabId } from './types';

export function getTab(url: string) {
  const parts = url.split('/');
  return { tab: parts[2] as TabId, isRoot: parts.length === 3 };
}
