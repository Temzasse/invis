import { forwardRef } from 'react';

import { styled } from '~styles/styled';
import { Text } from './Text';

type Props = React.ComponentPropsWithoutRef<'input'> & {
  label: string;
  message?: string;
};

export const TextInput = forwardRef<HTMLInputElement, Props>(
  ({ label, message, type = 'text', ...props }, ref) => {
    return (
      <Label>
        <Text variant="body" color="text">
          {label}
        </Text>
        <Input ref={ref} type={type} {...props} />
        {message && (
          <Text variant="bodySmall" color="textMuted">
            {message}
          </Text>
        )}
      </Label>
    );
  }
);

TextInput.displayName = 'TextInput';

const Label = styled('label', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$xsmall',
});

const Input = styled('input', {
  padding: '$small $regular',
  backgroundColor: '$background',
  color: '$text',
  border: '1px solid $border',
  borderRadius: '$medium',
  outline: 'none',
});
