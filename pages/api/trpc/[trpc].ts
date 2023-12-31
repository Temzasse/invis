import * as trpcNext from '@trpc/server/adapters/next';

import { createTRPCContext } from '~/server/api/trpc';
import { appRouter } from '~/server/api/root';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  batching: { enabled: true },
});
