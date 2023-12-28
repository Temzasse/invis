import {
  FocusEventHandler,
  KeyboardEventHandler,
  useRef,
  useState,
} from 'react';

import { styled } from '~/styles/styled';
import { Touchable } from './Touchable';

type Props = {
  children: string;
  initialFocused?: boolean;
  onEditDone: (value: string) => void;
};

export function EditableText({ children, initialFocused, onEditDone }: Props) {
  const [isEditing, setEditing] = useState(!!initialFocused);

  if (!isEditing) {
    return <TextButton onPress={() => setEditing(true)}>{children}</TextButton>;
  }

  return (
    <TextInput
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

function TextInput({
  defaultValue,
  onBlur,
  onKeyDown,
}: {
  defaultValue: string;
  onBlur: FocusEventHandler<HTMLInputElement>;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
}) {
  const ref = useRef<HTMLInputElement>(null);

  function onFocus() {
    // NOTE: We need to wait for the keyboard to show up before scrolling
    // to the input, otherwise the keyboard will cover the input
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }

  return (
    <Input
      ref={ref}
      type="text"
      autoFocus
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      defaultValue={defaultValue}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
    />
  );
}

const TextButton = styled(Touchable, {
  typography: '$body',
  color: '$text',
  width: '100%',
  height: '100%',
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
