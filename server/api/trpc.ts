import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

import { getProjectFromCookies } from '~server/utils/project';
import { prisma } from '~server/db';

type CreateContextOptions = {
  project: null | { id: string };
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    prisma,
    project: opts.project,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const project = await getProjectFromCookies(opts.req.cookies);

  return createInnerTRPCContext({
    project: project ? { id: project.id } : null,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.project) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({ ctx: { project: ctx.project } });
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);