import { type VariantProps } from '@stitches/react';
import { forwardRef, memo, ComponentProps, ReactNode } from 'react';

import { styled } from '~/styles/styled';
import { Touchable } from './Touchable';
import { Icon, IconName } from './Icon';

type Props = VariantProps<typeof Root> &
  Omit<
    ComponentProps<typeof Root> & {
      children: ReactNode;
      icon: IconName;
      size?: number;
      onPress?: () => void;
    },
    'children'
  >;

const ratio = 5 / 3;

export const IconButton = memo(
  forwardRef<HTMLButtonElement, Props>(({ icon, size = 24, ...rest }, ref) => {
    return (
      <Root
        ref={ref}
        {...rest}
        style={{ width: ratio * size, height: ratio * size }}
        interaction="highlight"
      >
        <Icon name={icon} size={size} color="text" />
      </Root>
    );
  })
);

IconButton.displayName = 'IconButton';

const Root = styled(Touchable, {
  flexCenter: 'row',
  borderRadius: '$full',
});
