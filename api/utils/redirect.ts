import type { Project } from '@prisma/client';
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import type { ParsedUrlQuery } from 'querystring';
import { ensureProject } from '~api/project/service';

type AuthedGetServerSideProps<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery
> = (
  context: GetServerSidePropsContext<Q, any>,
  project: Project
) => Promise<GetServerSidePropsResult<P>>;

export function withProject<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery
>(getServerSideProps: AuthedGetServerSideProps<P, Q>) {
  return async function handler(context: GetServerSidePropsContext<Q>) {
    const { project, redirect } = await ensureProject(context.req);
    if (!project) return redirect;
    return getServerSideProps(context, project);
  };
}
