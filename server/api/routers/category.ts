import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '../../api/trpc';

export const categoryRouter = createTRPCRouter({
  getCategory: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.category.findUnique({
        where: { id: input.id },
        include: { items: true },
      });
    }),

  getCategories: protectedProcedure.query(async ({ ctx }) => {
    const project = await ctx.prisma.project.findUnique({
      where: { id: ctx.session.currentProjectId },
      include: { categories: true },
    });

    return project?.categories ?? [];
  }),

  getCategoriesWithItems: protectedProcedure.query(async ({ ctx }) => {
    const project = await ctx.prisma.project.findUnique({
      where: { id: ctx.session.currentProjectId },
      include: { categories: { include: { items: true } } },
    });

    return project?.categories ?? [];
  }),

  createCategory: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.create({
        data: {
          name: input.name,
          project: { connect: { id: ctx.session.currentProjectId } },
        },
      });

      return category;
    }),

  addItemToCategory: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        status: z.string().optional(),
        categoryId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const category = await ctx.prisma.category.findUnique({
        where: { id: input.categoryId },
      });

      if (!category) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const item = await ctx.prisma.item.create({
        data: {
          name: input.name,
          status: input.status,
          category: { connect: { id: input.categoryId } },
        },
      });

      return item;
    }),
});
