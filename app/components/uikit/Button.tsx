import type { VariantProps } from '@stitches/react';
import { forwardRef, memo, ComponentProps, ReactNode } from 'react';

import { styled } from 'app/styles/styled';
import { Touchable } from './Touchable';

type Props = VariantProps<typeof Root> &
  Omit<
    ComponentProps<typeof Root> & {
      children: ReactNode;
      variant?: 'filled' | 'outlined';
      asLink?: boolean;
      onPress?: () => void;
    },
    'onClick'
  >;

export const Button = memo(
  forwardRef<HTMLButtonElement, Props>(({ children, ...rest }, ref) => {
    return (
      <Root
        ref={ref}
        {...rest}
        interaction={rest.variant === 'outlined' ? 'highlight' : 'opacity'}
      >
        <span>{children}</span>
      </Root>
    );
  })
);

Button.displayName = 'Button';

const Root = styled(Touchable, {
  display: 'block',
  textAlign: 'center',
  paddingVertical: '$regular',
  paddingHorizontal: '$large',
  borderRadius: '$full',
  typography: '$bodyBold',
  border: '1px solid $primaryMuted',
  variants: {
    variant: {
      filled: {
        color: '$primaryText',
        backgroundColor: '$primaryMuted',
      },
      outlined: {
        color: '$primaryMuted',
        backgroundColor: '$transparent',
      },
    },
  },
  defaultVariants: {
    variant: 'filled',
  },
});
