import { type VariantProps } from '@stitches/react';
import { forwardRef, ComponentProps } from 'react';

import { styled } from '~/styles/styled';
import { themeProp } from '~/styles/helpers';

type Props = VariantProps<typeof Root> &
  ComponentProps<typeof Root> & {
    as?: keyof JSX.IntrinsicElements;
  };

export const Stack = forwardRef<HTMLDivElement, Props>(
  ({ as: asTag, ...rest }, ref) => {
    return <Root {...rest} as={asTag} ref={ref} />;
  }
);

Stack.displayName = 'Stack';

const Root = styled('div', {
  display: 'flex',
  variants: {
    ...themeProp('spacing', 'space', (value) => ({
      gap: value,
    })),
    direction: {
      x: { flexDirection: 'row' },
      y: { flexDirection: 'column' },
    },
    align: {
      start: { alignItems: 'flex-start' },
      end: { alignItems: 'flex-end' },
      center: { alignItems: 'center' },
      stretch: { alignItems: 'stretch' },
      baseline: { alignItems: 'baseline' },
    },
    justify: {
      start: { justifyContent: 'flex-start' },
      end: { justifyContent: 'flex-end' },
      center: { justifyContent: 'center' },
      stretch: { justifyContent: 'stretch' },
      around: { justifyContent: 'space-around' },
      between: { justifyContent: 'space-between' },
      evenly: { justifyContent: 'space-evenly' },
    },
    wrap: {
      true: { flexWrap: 'wrap' },
      false: {},
    },
  },
  defaultVariants: {
    spacing: 'regular',
    direction: 'y',
  },
});
