import { type ShoplistItem } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { orderBy } from 'lodash';
import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '../../api/trpc';

import { publish, subscribe } from '../../utils/redis';

type ShoplistEvent =
  | { operation: 'add'; item: ShoplistItem }
  | { operation: 'remove'; item: ShoplistItem }
  | { operation: 'update'; item: ShoplistItem }
  | { operation: 'complete' };

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

      publish(`shoplist:${item.shoplistId}`, {
        operation: 'add',
        item,
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

      publish(`shoplist:${item.shoplistId}`, {
        operation: 'update',
        item,
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

      publish(`shoplist:${item.shoplistId}`, {
        operation: 'remove',
        item,
      });

      return item;
    }),

  onChange: publicProcedure
    .input(z.object({ shoplistId: z.string() }))
    .subscription(({ input }) => {
      return observable((observer) => {
        const unsubscribe = subscribe<ShoplistEvent>(
          `shoplist:${input.shoplistId}`,
          (data) => {
            if ('operation' in data) {
              observer.next(data);
            }
          }
        );

        return unsubscribe;
      });
    }),
});
