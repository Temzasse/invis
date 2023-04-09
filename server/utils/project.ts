import { type NextApiResponse, type NextApiRequest } from 'next';
import { type Project } from '@prisma/client';

import { prisma } from '~server/db';
import { setCookie } from './cookie';

const PROJECT_COOKIE_NAME = 'project';
const PROJECT_COOKIE_EXPIRY = 31536000; // 1 year

export function parseProjectCookie(value: string): { id: string } {
  if (value.startsWith('j:')) {
    return JSON.parse(value.slice(2));
  } else {
    throw new Error('Invalid project cookie value');
  }
}

export async function getProjectFromCookies(
  cookies: NextApiRequest['cookies']
) {
  if (!cookies.project) {
    return null;
  }

  let project: null | Project = null;

  try {
    const projectCookie = cookies[PROJECT_COOKIE_NAME];
    const { id } = parseProjectCookie(projectCookie);
    project = await prisma.project.findUnique({ where: { id } });
  } catch (error) {
    console.error('> Failed to parse project cookie', error);
  }

  return project;
}

export function setProjectCookie(res: NextApiResponse, projectId: string) {
  setCookie(
    res,
    PROJECT_COOKIE_NAME,
    { id: projectId },
    { httpOnly: true, sameSite: 'lax', maxAge: PROJECT_COOKIE_EXPIRY }
  );
}
