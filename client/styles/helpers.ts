import { config, Theme } from './styled';

type ThemeKey = keyof Theme;

export function themeProp<P extends string, T extends ThemeKey>(
  prop: P,
  themeKey: T,
  getStyles: (token: string) => any
) {
  const result = {
    [prop]: {},
  } as {
    [prop in P]: {
      [token in keyof Theme[T]]: any;
    };
  };

  Object.keys(config.theme[themeKey]).forEach((t) => {
    const token = t as keyof Theme[T];
    result[prop][token] = getStyles(`$${token as string}`);
  });

  return result;
}
