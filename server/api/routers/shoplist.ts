import { TRPCError } from '@trpc/server';
import { orderBy } from 'lodash';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

export const shoplistRouter = createTRPCRouter({
  getCurrentShoplist: protectedProcedure.query(async ({ ctx }) => {
    const project = await ctx.prisma.project.findUnique({
      where: { id: ctx.project.id },
      include: { shoplists: true },
    });

    if (!project) {
      throw new TRPCError({ code: 'BAD_REQUEST' });
    }

    let shoplist = orderBy(project.shoplists, 'createdAt', 'desc')[0];

    if (!shoplist || shoplist.completed) {
      shoplist = await ctx.prisma.shoplist.create({
        data: { project: { connect: { id: ctx.project.id } } },
      });
    }

    return ctx.prisma.shoplist.findUnique({
      where: { id: shoplist.id },
      include: { items: true },
    });
  }),

  completeShoplist: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const shoplist = await ctx.prisma.shoplist.findUnique({
        where: { id: input.id },
      });

      if (!shoplist) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const updatedShoplist = await ctx.prisma.shoplist.update({
        where: { id: input.id },
        data: { completed: true },
      });

      return updatedShoplist;
    }),

  addShoplistItem: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        shoplistId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const shoplist = await ctx.prisma.shoplist.findUnique({
        where: { id: input.shoplistId },
      });

      if (!shoplist) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const item = await ctx.prisma.shoplistItem.create({
        data: {
          name: input.name,
          checked: false,
          shoplist: { connect: { id: input.shoplistId } },
        },
      });

      return item;
    }),

  updateShoplistItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        checked: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.shoplistItem.update({
        where: { id: input.id },
        data: { name: input.name, checked: input.checked },
      });

      return item;
    }),

  removeShoplistItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.shoplistItem.delete({
        where: { id: input.id },
      });

      return item;
    }),
});
