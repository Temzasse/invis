import type * as typography from './typography';

const rootFontSize = 16;

export function rem(px: number): string {
  return `${px / rootFontSize}rem`;
}

export function mapToPx<T extends Record<string, number>, K extends keyof T>(
  obj: T
) {
  const result = {} as Record<K, string>;

  Object.keys(obj).forEach((key) => {
    result[key as K] = `${obj[key]}px`;
  });

  return result;
}

export function mapToRem<T extends Record<string, number>, K extends keyof T>(
  obj: T
) {
  const result = {} as Record<K, string>;

  Object.keys(obj).forEach((key) => {
    result[key as K] = rem(obj[key]);
  });

  return result;
}

type TypographyVariants = typeof typography;
type TypographyVariant = keyof TypographyVariants;
type TypographySpec = TypographyVariants['body'];

export function mapTypography(
  obj: TypographyVariants,
  field: keyof TypographySpec
) {
  const result = {} as Record<TypographyVariant, string>;

  Object.keys(obj).forEach((k) => {
    const key = k as TypographyVariant;

    if (field === 'fontSize') {
      result[key] = rem(obj[key][field]);
    } else {
      result[key] = String(obj[key][field]);
    }
  });

  return result;
}

type Shadow = {
  boxShadow: string;
  offset: { x: number; y: number };
  radius: number;
  opacity: number;
  color: { hex: string; rgba: string };
};

export function mapToBoxShadow<
  T extends Record<string, Shadow[]>,
  K extends keyof T
>(obj: T) {
  const result = {} as Record<K, string>;

  Object.keys(obj).forEach((key) => {
    result[key as K] = obj[key].map((shadow) => shadow.boxShadow).join(', ');
  });

  return result;
}
