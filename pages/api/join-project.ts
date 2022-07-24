import type { NextApiRequest, NextApiResponse } from 'next';

import { setCookie } from '~api/utils/cookie';
import { prisma } from '~api/utils/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
      { httpOnly: true, sameSite: 'lax' }
    );

    res.redirect('/app/home');
  } else {
    res.redirect('/');
  }
}
