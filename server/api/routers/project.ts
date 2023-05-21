import { z } from 'zod';
import bcrypt from 'bcrypt';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~server/api/trpc';

import { setProjectCookie } from '~server/utils/project';
import { TRPCError } from '@trpc/server';

const joinCreateInput = z.object({
  name: z.string(),
  password: z.string().min(8),
});

export const projectRouter = createTRPCRouter({
  createProject: publicProcedure
    .input(joinCreateInput)
    .mutation(async ({ ctx, input }) => {
      const existingProject = await ctx.prisma.project.findUnique({
        where: { name: input.name },
      });

      if (existingProject) {
        throw new TRPCError({ code: 'CONFLICT' });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const project = await ctx.prisma.project.create({
        data: {
          name: input.name,
          password: hashedPassword,
        },
      });

      setProjectCookie(ctx.res, project.id);

      return project;
    }),

  joinProject: publicProcedure
    .input(joinCreateInput)
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: { name: input.name },
      });

      if (!project) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      const matches = await bcrypt.compare(input.password, project.password);

      if (!matches) {
        throw new TRPCError({ code: 'BAD_REQUEST' });
      }

      setProjectCookie(ctx.res, project.id);
    }),

  getProject: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.project.findUnique({
      where: { id: ctx.project.id },
      select: { name: true, id: true },
    });
  }),

  updateItemStatuses: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            id: z.string(),
            status: z.string(),
          })
        ),
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

  updateItemStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.item.update({
        where: { id: input.id },
        data: { status: input.status },
      });

      return result;
    }),
});
