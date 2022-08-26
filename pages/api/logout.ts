import type { NextApiRequest, NextApiResponse } from 'next';
import { clearCookie } from '~api/utils/cookie';

type Data = {
  status: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    clearCookie(res, 'project');
    res.redirect('/');
  } else {
    res.status(404).end();
  }
}
