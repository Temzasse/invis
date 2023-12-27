import { type ComponentProps } from 'react';
import { type VariantProps } from '@stitches/react';

import { type ids } from '~/styles/tokens/icon-sprite-ids';
import { styled } from '~/styles/styled';
import { themeProp } from '~/styles/helpers';

export type IconName = typeof ids[number];

type Props = VariantProps<typeof Root> &
  ComponentProps<typeof Root> & {
    size?: number;
    name: IconName;
  };

export function Icon({ name, size = 24, color, ...rest }: Props) {
  return (
    <Root
      color={color}
      {...rest}
      style={{ width: size, height: size, ...rest.style }}
    >
      <use href={`/icon-sprite.svg#${name}`} />
    </Root>
  );
}

const Root = styled('svg', {
  display: 'inline-block',
  flexShrink: 0,
  fill: 'transparent',
  variants: {
    ...themeProp('color', 'colors', (value) => ({
      color: `${value}`,
    })),
  },
});
