import type { VariantProps } from '@stitches/react';
import { forwardRef, ComponentProps } from 'react';

import { styled, Typography } from 'app/styles/styled';
import { themeProp } from 'app/styles/helpers';

type Tags = keyof JSX.IntrinsicElements;
type Props = VariantProps<typeof Root> &
  ComponentProps<typeof Root> & {
    as?: Tags;
  };

export const Text = forwardRef<HTMLElement, Props>(
  ({ variant, as: asTag, ...rest }, ref) => {
    const v = typeof variant === 'string' ? variant : variant?.['@initial'] ?? 'body'; // prettier-ignore
    const tag = asTag || variantToTag[v];
    return <Root {...rest} as={tag} variant={variant} ref={ref} />;
  }
);

Text.displayName = 'Text';

const variantToTag: { [key in Typography]: Partial<Tags> } = {
  title1: 'h1',
  title2: 'h2',
  body: 'span',
  bodyBold: 'strong',
  bodySmall: 'span',
  bodySmallBold: 'strong',
  overline: 'span',
};

const Root = styled('span', {
  color: '$text',
  variants: {
    variant: {
      title1: { typography: '$title1' },
      title2: { typography: '$title2' },
      body: { typography: '$body' },
      bodyBold: { typography: '$bodyBold' },
      bodySmall: { typography: '$bodySmall' },
      bodySmallBold: { typography: '$bodySmallBold' },
      overline: { typography: '$overline', textTransform: 'uppercase' },
    },
    ...themeProp('color', 'colors', (value) => ({
      color: `${value}`,
    })),
    align: {
      left: { textAlign: 'left' },
      center: { textAlign: 'center' },
      right: { textAlign: 'right' },
    },
  },
  defaultVariants: {
    variant: 'body',
  },
});
