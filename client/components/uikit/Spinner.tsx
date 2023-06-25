import { themeProp } from '~styles/helpers';
import { styled, keyframes, Color } from '~styles/styled';

type Size = 'small' | 'normal' | 'medium' | 'large';

type Props = {
  color: Color | 'currentColor';
  size?: Size;
};

const rotateAnim = keyframes({
  from: {
    transform: 'rotate(0deg)',
  },
  to: {
    transform: 'rotate(359deg)',
  },
});

const BORDER_SIZE = 2;

const sizes = {
  small: 12 + BORDER_SIZE,
  regular: 18 + BORDER_SIZE,
  medium: 26 + BORDER_SIZE,
  large: 38 + BORDER_SIZE,
};

export const Spinner = styled('div', {
  position: 'relative',
  zIndex: 0,
  '&:before': {
    content: '',
    borderRadius: '50%',
    border: `${BORDER_SIZE}px solid currentColor`,
    opacity: 0.3,
    zIndex: -1,
    absoluteFill: true,
  },
  '&:after': {
    content: '',
    animation: `${rotateAnim} 0.6s infinite linear`,
    borderRadius: '50%',
    border: `${BORDER_SIZE}px solid currentColor`,
    borderTopColor: 'transparent',
    zIndex: 1,
    absoluteFill: true,
  },
  variants: {
    ...themeProp('color', 'colors', (value) => ({
      color: `${value}`,
    })),
    size: {
      small: { size: sizes.small },
      regular: { size: sizes.regular },
      medium: { size: sizes.medium },
      large: { size: sizes.large },
    },
  },
  defaultVariants: {
    size: 'regular',
    color: 'text',
  },
});
