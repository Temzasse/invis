import type { NextApiRequest, NextApiResponse } from 'next';

import { getProjectCategoriesWithItems } from '~api/project/service';
import { parseProjectCookie } from '~api/project/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const projectCookie = req.cookies.project;

    if (!projectCookie) {
      res.status(404).end();
      return;
    }

    const { name, pin } = parseProjectCookie(projectCookie);

    const categories = await getProjectCategoriesWithItems({
      name,
      pin,
    });

    return res.status(200).json(categories);
  } else {
    res.status(404).end();
  }
}
