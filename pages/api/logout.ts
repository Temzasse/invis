import { type NextApiRequest, NextApiResponse } from 'next';

import { clearCookie } from '~/server/utils/cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    clearCookie(res, 'project');
    res.redirect('/');
  } else {
    res.status(404).end();
  }
}
