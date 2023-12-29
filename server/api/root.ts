import superjson from 'superjson';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { type ParsedUrlQuery } from 'querystring';

import {
  type GetServerSidePropsContext,
  type GetServerSidePropsResult,
  type PreviewData,
} from 'next';

import { createTRPCContext, createTRPCRouter } from './trpc';
import { projectRouter } from './routers/project';
import { categoryRouter } from './routers/category';
import { shoplistRouter } from './routers/shoplist';
import { getProjectFromCookies } from '~/server/utils/project';

export const appRouter = createTRPCRouter({
  project: projectRouter,
  category: categoryRouter,
  shoplist: shoplistRouter,
});

export type AppRouter = typeof appRouter;

// NOTE: this is only needed for getting the `api` type in `withApiSession`
const _api = createServerSideHelpers({ router: appRouter, ctx: {} as any });

type Api = typeof _api;

export function withApiSession<
  Props extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
>(
  getServerSideProps?: (
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
          destination: '/login',
          permanent: false,
        },
      };
    }

    const api = createServerSideHelpers({
      router: appRouter,
      ctx: await createTRPCContext(context as any),
      transformer: superjson,
    });

    let props: any = {};

    if (getServerSideProps) {
      try {
        props = await getServerSideProps(context, api);
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
