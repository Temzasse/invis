import type { Project } from '@prisma/client';
import type { ParsedUrlQuery } from 'querystring';

import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from 'next';

import { ensureProject } from '~api/project/service';

type AuthedGetServerSideProps<
  Props extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData
> = (
  context: GetServerSidePropsContext<Params, Preview>,
  project: Project
) => Promise<GetServerSidePropsResult<Props>>;

export function withProject<
  Props extends { [key: string]: any } = { [key: string]: any },
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData
>(getServerSideProps: AuthedGetServerSideProps<Props, Params>) {
  return async function handler(
    context: GetServerSidePropsContext<Params, Preview>
  ): Promise<GetServerSidePropsResult<Props>> {
    const { project, redirect } = await ensureProject(context.req);
    if (!project) return redirect;
    return getServerSideProps(context, project);
  };
}
