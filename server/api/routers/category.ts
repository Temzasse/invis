import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~server/api/trpc';

export const categoryRouter = createTRPCRouter({
  getCategory: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.category.findUnique({
        where: { id: input.id },
      });
    }),

  getCategories: protectedProcedure.query(async ({ ctx }) => {
    const project = await ctx.prisma.project.findUnique({
      where: { id: ctx.project.id },
      include: { categories: true },
    });

    return project?.categories ?? [];
  }),

  getCategoriesWithItems: protectedProcedure.query(async ({ ctx }) => {
    const project = await ctx.prisma.project.findUnique({
      where: { id: ctx.project.id },
      include: { categories: { include: { items: true } } },
    });

    return project?.categories ?? [];
  }),
});
