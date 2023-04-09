import { createTRPCRouter } from './trpc';
import { projectRouter } from './routers/project';
import { categoryRouter } from './routers/category';

export const appRouter = createTRPCRouter({
  project: projectRouter,
  category: categoryRouter,
});

export type AppRouter = typeof appRouter;
