import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

import { getProjectFromCookies } from '~server/utils/project';
import { prisma } from '~server/db';

type CreateContextOptions = {
  project: null | { id: string };
  res: CreateNextContextOptions['res'];
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    prisma,
    project: opts.project,
    res: opts.res,
  };
};

export const createTRPCContext = async (context: CreateNextContextOptions) => {
  const project = await getProjectFromCookies(context.req.cookies);

  return createInnerTRPCContext({
    project: project ? { id: project.id } : null,
    res: context.res,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

const enforceSession = t.middleware(({ ctx, next }) => {
  if (!ctx.project) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({ ctx: { project: ctx.project } });
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceSession);
