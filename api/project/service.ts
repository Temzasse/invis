import type { GetServerSideProps } from 'next';
import { listProjectCategoriesWithItems } from './dao';
import { parseProjectCookie } from './utils';

export async function getProjectCategoriesWithItems(
  req: Parameters<GetServerSideProps>[0]['req']
) {
  const project = req.cookies.project as string;
  const { name, pin } = parseProjectCookie(project);
  const categories = await listProjectCategoriesWithItems({ name, pin });
  return categories;
}
