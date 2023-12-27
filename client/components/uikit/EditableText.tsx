import { useState } from 'react';

import { styled } from '~/styles/styled';
import { Touchable } from './Touchable';

type Props = {
  children: string;
  onEditDone: (value: string) => void;
};

export function EditableText({ children, onEditDone }: Props) {
  const [isEditing, setEditing] = useState(false);

  if (!isEditing) {
    return <TextButton onPress={() => setEditing(true)}>{children}</TextButton>;
  }

  return (
    <Input
      type="text"
      autoFocus
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      defaultValue={children}
      onBlur={(event) => {
        onEditDone(event.currentTarget.value);
        setEditing(false);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          onEditDone(event.currentTarget.value);
          setEditing(false);
        }
      }}
    />
  );
}

const TextButton = styled(Touchable, {
  typography: '$body',
  color: '$text',
  width: '100%',
  textAlign: 'left',
});

const Input = styled('input', {
  appearance: 'none',
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  color: '$text',
  typography: '$body',
  padding: 0,
  margin: 0,
  width: '100%',
});
