import type { Project } from '@prisma/client';
import type { GetServerSideProps } from 'next';

import {
  findProject,
  listProjectCategories,
  listProjectCategoriesWithItems,
} from './dao';

import { parseProjectCookie } from './utils';

export async function getProjectCategoriesWithItems({
  name,
  pin,
}: {
  name: string;
  pin: string;
}) {
  return listProjectCategoriesWithItems({ name, pin });
}

export async function getProjectCategories({
  name,
  pin,
}: {
  name: string;
  pin: string;
}) {
  return listProjectCategories({ name, pin });
}

export async function getProjectCategory({
  name,
  pin,
  categoryId,
}: {
  name: string;
  pin: string;
  categoryId: string;
}) {
  return listProjectCategories({ name, pin });
}

export async function getProject({ name, pin }: { name: string; pin: string }) {
  return findProject({ name, pin });
}

export async function ensureProject(
  req: Parameters<GetServerSideProps>[0]['req']
) {
  const redirect = {
    props: {},
    redirect: { destination: '/', permanent: false },
  };

  let project: null | Project = null;

  if (req.cookies.project) {
    const projectCookie = req.cookies.project;
    const { name, pin } = parseProjectCookie(projectCookie);
    project = await getProject({ name, pin });
  }

  return { project, redirect };
}
