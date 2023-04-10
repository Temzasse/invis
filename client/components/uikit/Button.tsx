import { type VariantProps } from '@stitches/react';
import { forwardRef, memo, ComponentProps, ReactNode } from 'react';

import { styled } from '~styles/styled';
import { Touchable } from './Touchable';
import { Icon, IconName } from './Icon';
import { Stack } from './Stack';

type Props = VariantProps<typeof Root> &
  ComponentProps<typeof Root> & {
    children: ReactNode;
    variant?: 'filled' | 'outlined';
    asLink?: boolean;
    fullWidth?: boolean;
    icon?: IconName;
    iconPlacement?: 'left' | 'right';
    onPress?: () => void;
  };

export const Button = memo(
  forwardRef<HTMLButtonElement, Props>(
    ({ children, icon, iconPlacement = 'right', ...rest }, ref) => {
      return (
        <Root
          ref={ref}
          {...rest}
          withIcon={!!icon}
          iconPlacement={iconPlacement}
          interaction={rest.variant === 'outlined' ? 'highlight' : 'opacity'}
        >
          <Stack spacing="small" direction="x">
            {!!icon && iconPlacement === 'left' && (
              <Icon name={icon} size={20} />
            )}
            <ButtonLabel>{children}</ButtonLabel>
            {!!icon && iconPlacement === 'right' && (
              <Icon name={icon} size={20} />
            )}
          </Stack>
        </Root>
      );
    }
  )
);

Button.displayName = 'Button';

const Root = styled(Touchable, {
  display: 'block',
  padding: '$regular',
  borderRadius: '$medium',
  border: '1px solid $primaryMuted',
  variants: {
    variant: {
      filled: {
        color: '$primaryContrast',
        backgroundColor: '$primaryMuted',
      },
      outlined: {
        color: '$primaryMuted',
        backgroundColor: '$transparent',
      },
    },
    fullWidth: { true: { width: '100%' } },
    withIcon: { true: {}, false: {} },
    iconPlacement: { left: {}, right: {} },
  },
  compoundVariants: [
    {
      withIcon: true,
      iconPlacement: 'right',
      css: { paddingLeft: '$xlarge' },
    },
    {
      withIcon: true,
      iconPlacement: 'left',
      css: { paddingRight: '$xlarge' },
    },
  ],
  defaultVariants: {
    variant: 'filled',
  },
});

const ButtonLabel = styled('div', {
  flex: 1,
  textAlign: 'center',
  typography: '$bodyBold',
});
