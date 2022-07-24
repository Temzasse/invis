import { serialize, CookieSerializeOptions } from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from './db';

export function setCookie(
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) {
  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

  if (typeof options.maxAge === 'number') {
    options.expires =
      options.maxAge === 0
        ? new Date(0)
        : new Date(Date.now() + options.maxAge * 1000);
  }

  res.setHeader('Set-Cookie', serialize(name, stringValue, options));
}

export function clearCookie(res: NextApiResponse, name: string) {
  setCookie(res, name, '', { maxAge: 0 });
}

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
