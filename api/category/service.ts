import { findCategory } from './dao';

export async function getCategory({ id }: { id: string }) {
  return findCategory({ id });
}
