import { forwardRef } from 'react';

import { styled } from '~styles/styled';
import { Text } from './Text';
import { Icon } from './Icon';

type Props = React.ComponentPropsWithoutRef<'select'> & {
  label: string;
  message?: string;
};

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, message, ...props }, ref) => {
    return (
      <Label>
        <Text variant="body" color="text">
          {label}
        </Text>

        <InputWrapper>
          <Input ref={ref} {...props} />

          <InputIcon name="chevronBottom" color="textMuted" />
        </InputWrapper>

        {message && (
          <Text variant="bodySmall" color="textMuted">
            {message}
          </Text>
        )}
      </Label>
    );
  }
);

Select.displayName = 'Select';

const Label = styled('label', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$xsmall',
});

const InputWrapper = styled('div', {
  position: 'relative',
  width: '100%',
});

const Input = styled('select', {
  appearance: 'none',
  width: '100%',
  padding: '$small $regular',
  backgroundColor: 'transparent',
  color: '$text',
  border: '1px solid $border',
  borderRadius: '$medium',
  outline: 'none',
});

const InputIcon = styled(Icon, {
  position: 'absolute',
  top: '50%',
  right: '$regular',
  transform: 'translateY(-50%)',
});
