import { type NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '~server/db';
import { setCookie } from '~server/utils/cookie';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { name, pin } = req.query;

    if (typeof name !== 'string' || typeof pin !== 'string') {
      return res.redirect('/');
    }

    const project = await prisma.project.findUnique({
      where: { name_pin: { name, pin } },
    });

    if (project) {
      setCookie(
        res,
        'project',
        { name: project.name, pin: project.pin },
        { httpOnly: true, sameSite: 'lax', maxAge: 31536000 } // 1 year
      );

      res.redirect('/app/home');
    } else {
      res.redirect('/');
    }
  } else {
    res.status(404).end();
  }
}
