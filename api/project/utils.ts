import type { NextApiRequest, NextApiResponse } from 'next';
import { clearCookie } from '~api/utils/cookie';
import { prisma } from '~api/utils/db';

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
