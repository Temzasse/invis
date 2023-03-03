import type { NextApiRequest, NextApiResponse, GetServerSideProps } from 'next';
import type { Project } from '@prisma/client';
import { clearCookie } from '~api/utils/cookie';
import { prisma } from '~api/utils/db';
import { findProject } from './dao';

export function parseProjectCookie(value: string): {
  name: string;
  pin: string;
} {
  if (value.startsWith('j:')) {
    return JSON.parse(value.slice(2));
  } else {
    throw new Error('Invalid project cookie value');
  }
}

export async function getProjectFromCookie(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { project: projectCookie = '' } = req.cookies;

  try {
    const name_pin = parseProjectCookie(projectCookie);
    const project = await prisma.project.findUnique({ where: { name_pin } });
    return project;
  } catch (error) {
    clearCookie(res, 'project');
    res.redirect('/');
    return null;
  }
}

export async function ensureProject(
  req: Parameters<GetServerSideProps>[0]['req']
) {
  const redirect = {
    props: {},
    redirect: { destination: '/', permanent: false },
  };

  let project: null | Project = null;

  if (req.cookies.project) {
    const projectCookie = req.cookies.project;
    const { name, pin } = parseProjectCookie(projectCookie);
    project = await findProject({ name, pin });
  }

  return { project, redirect };
}
