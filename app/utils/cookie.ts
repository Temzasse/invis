import { StateStorage } from 'zustand/middleware';
import cookie from 'js-cookie';

export const cookieStorage: StateStorage = {
  getItem: (key: string) => {
    return cookie.get(key) || null;
  },
  setItem: (key: string, value: string) => {
    cookie.set(key, value, { expires: 1000 });
  },
  removeItem: (key: string) => {
    cookie.remove(key);
  },
};
