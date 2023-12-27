import { ComponentProps, forwardRef } from 'react';
import { styled } from '~/styles/styled';

type Props = Omit<ComponentProps<typeof Root>, 'type'>;

export const Checkbox = forwardRef<HTMLInputElement, Props>((props, ref) => {
  return <Root ref={ref} type="checkbox" {...props} />;
});

Checkbox.displayName = 'Checkbox';

const Root = styled('input', {
  appearance: 'none',
  flexShrink: 0,
  display: 'grid',
  placeContent: 'center',
  width: 24,
  height: 24,
  borderRadius: '$full',
  border: '1px solid',
  borderColor: '$textMuted',
  // make a checkmark out of after and before pseudo elements
  '&:after, &:before': {
    content: '""',
    display: 'block',
    height: 2,
    backgroundColor: '$background',
    borderRadius: 1,
    opacity: 0,
    transition: 'opacity 0.2s ease-in-out',
  },
  '&:before': {
    transform: 'rotate(45deg) translate(2px, 3px)',
    width: 6,
  },
  '&:after': {
    transform: 'rotate(-60deg) translate(1px, 1px)',
    width: 10,
  },
  '&:checked': {
    backgroundColor: '$primary',
    borderColor: '$primary',
    '&:after, &:before': {
      opacity: 1,
    },
  },
});
