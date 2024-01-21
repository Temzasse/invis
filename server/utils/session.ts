import { type NextApiResponse, type NextApiRequest } from 'next';
import { type Project } from '@prisma/client';

import { prisma } from '../db';
import { setCookie } from './cookie';

const SESSION_COOKIE_NAME = 'session';
const SESSION_COOKIE_EXPIRY = 31536000; // 1 year

export type Session = {
  joinedProjectIds: Project['id'][];
  currentProjectId: Project['id'];
};

export function parseSessionCookie(value: string): Session {
  if (value.startsWith('j:')) {
    return JSON.parse(value.slice(2));
  } else {
    throw new Error('Invalid session cookie value');
  }
}

export async function validateSession(cookies: NextApiRequest['cookies']) {
  const sessionCookie = cookies[SESSION_COOKIE_NAME];

  if (!sessionCookie) {
    return false;
  }

  let isSessionValid = false;

  try {
    const { currentProjectId } = parseSessionCookie(sessionCookie);

    const project = await prisma.project.findUnique({
      where: { id: currentProjectId },
    });

    isSessionValid = Boolean(project);
  } catch (error) {
    console.error('> Session not valid', error);
  }

  return isSessionValid;
}

export function getSession(cookies: NextApiRequest['cookies']): Session | null {
  if (!cookies[SESSION_COOKIE_NAME]) {
    return null;
  }

  try {
    const session = parseSessionCookie(cookies[SESSION_COOKIE_NAME]);
    return session;
  } catch (error) {
    console.error('> Session not valid', error);
    return null;
  }
}

export function setSessionCookie(res: NextApiResponse, session: Session) {
  setCookie(res, SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: SESSION_COOKIE_EXPIRY,
  });
}
