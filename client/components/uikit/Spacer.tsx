import type { VariantProps } from '@stitches/react';
import type { ComponentProps } from 'react';

import { styled } from '~styles/styled';
import { themeProp } from '~styles/helpers';

type Props = VariantProps<typeof Root> & ComponentProps<typeof Root>;

export function Spacer(props: Props) {
  return <Root {...props} />;
}

const Root = styled('div', {
  $$amount: '$space$regular',
  flexShrink: 0,
  variants: {
    ...themeProp('amount', 'space', (value) => ({
      $$amount: `$space${value}`,
    })),
    direction: {
      x: { width: '$$amount', height: '0px' },
      y: { height: '$$amount', width: '0px' },
    },
  },
  defaultVariants: {
    direction: 'y',
    amount: 'regular',
  },
});
