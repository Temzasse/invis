import type { ComponentProps, ReactNode } from 'react';
import type { VariantProps } from '@stitches/react';
import { forwardRef } from 'react';

import { styled } from '~styles/styled';
import { Touchable } from './Touchable';

type Variants = VariantProps<typeof Root>;
type Props = Variants &
  Omit<
    ComponentProps<typeof Root> & {
      children: ReactNode;
      onPress: () => void;
    },
    'onClick'
  >;

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children, onPress, ...rest }, forwardedRef) => {
    return (
      <Root onPress={onPress} ref={forwardedRef}>
        <span>{children}</span>
      </Root>
    );
  }
);

Button.displayName = 'Button';

const Root = styled(Touchable, {
  paddingVertical: '$regular',
  paddingHorizontal: '$large',
  color: '$primaryText',
  backgroundColor: '$primaryMuted',
  borderRadius: '$full',
  typography: '$bodyBold',
});
