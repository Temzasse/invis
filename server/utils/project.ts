import { type NextApiRequest } from 'next';
import { type Project } from '@prisma/client';

import { prisma } from '~server/db';

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

export async function getProjectFromCookies(
  cookies: NextApiRequest['cookies']
) {
  if (!cookies.project) {
    return null;
  }

  let project: null | Project = null;

  try {
    const projectCookie = cookies.project;
    const { name, pin } = parseProjectCookie(projectCookie);

    project = await prisma.project.findUnique({
      where: { name_pin: { name, pin } },
    });
  } catch (error) {
    console.error('> Failed to parse project cookie', error);
  }

  return project;
}
