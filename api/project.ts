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

  console.log('> Project', project);

  if (!project) return null;

  return project.categories;
}

export async function listProjectItems({
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

  console.log('> Project', project);

  return [];
}
