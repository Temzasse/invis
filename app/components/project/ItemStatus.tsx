import { styled } from '~styles/styled';

export type ItemStatusEnum = 'missing' | 'partial' | 'full';

export const ItemStatus = styled('div', {
  $$glowColor: 'transparent',
  width: 24,
  height: 24,
  position: 'relative',
  flexCenter: 'row',
  borderWidth: 2,
  borderStyle: 'solid',
  borderRadius: '$circle',
  boxShadow: '-8px 8px 64px $$glowColor',
  '&::after': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 3,
    left: 3,
    right: 3,
    bottom: 3,
    borderRadius: '$circle',
  },
  variants: {
    status: {
      missing: {
        $$glowColor: '$colors$statusMissing',
        borderColor: '$statusMissing',
        '&::after': {
          backgroundColor: '$statusMissing',
          clipPath: 'circle(35% at bottom center)',
        },
      },
      partial: {
        $$glowColor: '$colors$statusPartial',
        borderColor: '$statusPartial',
        '&::after': {
          backgroundColor: '$statusPartial',
          clipPath: 'circle(70% at bottom center)',
        },
      },
      full: {
        $$glowColor: '$colors$statusFull',
        borderColor: '$statusFull',
        '&::after': {
          backgroundColor: '$statusFull',
        },
      },
    },
  },
  defaultVariants: {
    status: 'missing',
  },
});
