import { type NextApiResponse } from 'next';
import { type CookieSerializeOptions } from 'cookie';
import { serialize } from 'cookie';

export function setCookie(
  res: NextApiResponse,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) {
  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

  if (typeof options.maxAge === 'number' && options.maxAge > 0) {
    options.expires =
      options.maxAge === 0
        ? new Date(0)
        : new Date(Date.now() + options.maxAge * 1000);
  }

  res.setHeader(
    'Set-Cookie',
    serialize(name, stringValue, { path: '/', ...options })
  );
}

export function clearCookie(res: NextApiResponse, name: string) {
  setCookie(res, name, '', { maxAge: 0 });
}
