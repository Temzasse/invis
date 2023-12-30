import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { NodeHTTPCreateContextFnOptions } from '@trpc/server/dist/adapters/node-http';
import { initTRPC, TRPCError } from '@trpc/server';
import { IncomingMessage } from 'http';
import superjson from 'superjson';

import { getProjectFromCookies } from '../utils/project';
import { prisma } from '../db';

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

export const createTRPCContext = async ({
  req,
  res,
}: CreateNextContextOptions) => {
  const project = await getProjectFromCookies(req.cookies);

  return createInnerTRPCContext({
    project: project ? { id: project.id } : null,
    res: res,
  });
};

// TODO: how to authenticate websocket connections?
export const createWebSocketTRPCContext = async ({
  res,
}: NodeHTTPCreateContextFnOptions<IncomingMessage, WebSocket>) => {
  return { prisma, res };
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
