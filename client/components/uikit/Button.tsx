import { type VariantProps } from '@stitches/react';
import { forwardRef, memo, ComponentProps, ReactNode } from 'react';

import { styled } from '~styles/styled';
import { Touchable } from './Touchable';
import { Icon, IconName } from './Icon';
import { Stack } from './Stack';
import { Spinner } from './Spinner';

type Props = VariantProps<typeof Root> &
  ComponentProps<typeof Root> & {
    children: ReactNode;
    variant?: 'filled' | 'outlined';
    asLink?: boolean;
    fullWidth?: boolean;
    icon?: IconName;
    iconPlacement?: 'left' | 'right';
    isLoading?: boolean;
    onPress?: () => void;
  };

export const Button = memo(
  forwardRef<HTMLButtonElement, Props>(
    ({ children, icon, iconPlacement = 'right', isLoading, ...rest }, ref) => {
      const decoration = isLoading ? (
        <Spinner color="primaryContrast" />
      ) : icon ? (
        <Icon name={icon} size={20} />
      ) : null;

      return (
        <Root
          ref={ref}
          {...rest}
          withIcon={!!decoration}
          iconPlacement={iconPlacement}
          interaction={rest.variant === 'outlined' ? 'highlight' : 'opacity'}
        >
          <Stack spacing="small" direction="x">
            {Boolean(decoration && iconPlacement === 'left') && (
              <ButtonDecoration placement="left">{decoration}</ButtonDecoration>
            )}

            <ButtonLabel>{children}</ButtonLabel>

            {Boolean(decoration && iconPlacement === 'right') && (
              <ButtonDecoration placement="right">
                {decoration}
              </ButtonDecoration>
            )}
          </Stack>
        </Root>
      );
    }
  )
);

Button.displayName = 'Button';

const Root = styled(Touchable, {
  position: 'relative',
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
    withIcon: { true: { paddingHorizontal: '$xlarge' }, false: {} },
    iconPlacement: { left: {}, right: {} },
  },
  defaultVariants: {
    variant: 'filled',
  },
});

const ButtonLabel = styled('div', {
  flex: 1,
  textAlign: 'center',
  typography: '$bodyBold',
});

const ButtonDecoration = styled('div', {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  variants: {
    placement: {
      left: { left: '$regular' },
      right: { right: '$regular' },
    },
  },
});
