import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { NodeHTTPCreateContextFnOptions } from '@trpc/server/dist/adapters/node-http';
import { initTRPC, TRPCError } from '@trpc/server';
import { IncomingMessage } from 'http';
import superjson from 'superjson';

import { Session, getSession } from '../utils/session';
import { prisma } from '../db';

type CreateContextOptions = {
  session: null | Session;
  res: CreateNextContextOptions['res'];
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    prisma,
    session: opts.session,
    res: opts.res,
  };
};

export const createTRPCContext = async ({
  req,
  res,
}: CreateNextContextOptions) => {
  const session = getSession(req.cookies);
  return createInnerTRPCContext({ session, res: res });
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
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({ ctx: { session: ctx.session } });
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceSession);
