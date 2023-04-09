import superjson from 'superjson';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { type ParsedUrlQuery } from 'querystring';

import {
  type GetServerSidePropsContext,
  type GetServerSidePropsResult,
  type PreviewData,
} from 'next';

import { prisma } from '~server/db';
import { createTRPCRouter } from './trpc';
import { projectRouter } from './routers/project';
import { categoryRouter } from './routers/category';
import { getProjectFromCookies } from '~server/utils/project';

export const appRouter = createTRPCRouter({
  project: projectRouter,
  category: categoryRouter,
});

export type AppRouter = typeof appRouter;

// NOTE: this is only needed for getting the `ssg` type
const _api = createServerSideHelpers({ router: appRouter, ctx: {} as any });

type Api = typeof _api;

export function withApiSession<
  Props extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData
>(
  prefether?: (
    context: GetServerSidePropsContext<Params, Preview>,
    api: Api
  ) => Promise<Props | void>
) {
  return async function handler(
    context: GetServerSidePropsContext<Params, Preview>
  ): Promise<GetServerSidePropsResult<Props>> {
    const project = await getProjectFromCookies(context.req.cookies);

    if (!project) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const api = createServerSideHelpers({
      router: appRouter,
      ctx: { prisma, project },
      transformer: superjson,
    });

    let props: any = {};

    if (prefether) {
      try {
        props = await prefether(context, api);
      } catch (err) {
        return {
          props,
          notFound: true,
        };
      }
    }

    return {
      props: {
        ...props,
        trpcState: api.dehydrate(),
      } as any,
    };
  };
}
