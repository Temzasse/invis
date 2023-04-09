import { z } from 'zod';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~server/api/trpc';

import { setProjectCookie } from '~server/utils/project';

const PIN_LENGTH = 6;

const joinCreateInput = z.object({
  name: z.string(),
  pin: z.string().length(PIN_LENGTH),
});

export const projectRouter = createTRPCRouter({
  createProject: publicProcedure
    .input(joinCreateInput)
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.create({
        data: { name: input.name, pin: input.pin },
      });

      setProjectCookie(ctx.res, project.id);

      return project;
    }),

  joinProject: publicProcedure
    .input(joinCreateInput)
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: { name_pin: { name: input.name, pin: input.pin } },
      });

      if (project) {
        setProjectCookie(ctx.res, project.id);
      }
    }),

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
