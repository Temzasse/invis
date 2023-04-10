import { type NextApiRequest, type NextApiResponse } from 'next';

import { prisma } from '~server/db';
import { setProjectCookie } from '~server/utils/project';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { name, pin } = req.query;

    if (typeof name !== 'string' || typeof pin !== 'string') {
      return res.redirect('/login');
    }

    const project = await prisma.project.findUnique({
      where: { name_pin: { name, pin } },
    });

    if (project) {
      setProjectCookie(res, project.id);
      res.redirect('/app/home');
    } else {
      console.log(
        `> Project ${name} not found - cannot join, redirecting to /login`
      );
      res.redirect('/login');
    }
  } else {
    res.status(404).end();
  }
}
