import { type VariantProps } from '@stitches/react';
import { forwardRef, memo, ComponentProps, ReactNode } from 'react';

import { styled } from '~styles/styled';
import { Touchable } from './Touchable';
import { Icon, IconName } from './Icon';

type Props = VariantProps<typeof Root> &
  Omit<
    ComponentProps<typeof Root> & {
      children: ReactNode;
      icon: IconName;
      onPress?: () => void;
    },
    'children'
  >;

export const IconButton = memo(
  forwardRef<HTMLButtonElement, Props>(({ icon, ...rest }, ref) => {
    return (
      <Root ref={ref} {...rest} interaction="highlight">
        <Icon name={icon} size={24} color="text" />
      </Root>
    );
  })
);

IconButton.displayName = 'IconButton';

const Root = styled(Touchable, {
  flexCenter: 'row',
  width: 40,
  height: 40,
  borderRadius: '$full',
});
