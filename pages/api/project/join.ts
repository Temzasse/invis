import type { NextApiRequest, NextApiResponse } from 'next';

import { setCookie } from '~api/utils/cookie';
import { findProject } from '~api/project';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { name, pin } = req.query;

    if (typeof name !== 'string' || typeof pin !== 'string') {
      return res.redirect('/');
    }

    const project = await findProject({ name, pin });

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
  } else {
    res.status(404).end();
  }
}
