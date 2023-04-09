import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~server/api/trpc';

export const projectRouter = createTRPCRouter({
  getProject: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.project.findUnique({
      where: { id: ctx.project.id },
    });
  }),

  updateItemStatuses: protectedProcedure
    .input(
      z.object({
        items: z.array(z.object({ id: z.string(), status: z.string() })),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await Promise.all(
        input.items.map((item) =>
          ctx.prisma.item.update({
            where: { id: item.id },
            data: { status: item.status },
          })
        )
      );

      return result;
    }),
});
