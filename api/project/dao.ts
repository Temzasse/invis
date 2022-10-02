import { prisma } from '~api/utils/db';

export async function findProject({
  name,
  pin,
}: {
  name: string;
  pin: string;
}) {
  return await prisma.project.findUnique({
    where: { name_pin: { name, pin } },
  });
}

export async function listProjectCategories({
  name,
  pin,
}: {
  name: string;
  pin: string;
}) {
  const project = await prisma.project.findUnique({
    where: { name_pin: { name, pin } },
    include: { categories: true },
  });

  return project?.categories ?? [];
}

export async function listProjectCategoriesWithItems({
  name,
  pin,
}: {
  name: string;
  pin: string;
}) {
  const project = await prisma.project.findUnique({
    where: { name_pin: { name, pin } },
    include: { categories: { include: { items: true } } },
  });

  return project?.categories ?? [];
}