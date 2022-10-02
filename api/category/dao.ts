import { prisma } from '~api/utils/db';

export async function findCategory({ id }: { id: string }) {
  return await prisma.category.findUnique({
    where: { id },
  });
}
