import {
  FocusEvent,
  FocusEventHandler,
  KeyboardEventHandler,
  useRef,
  useState,
} from 'react';

import { styled } from '~/styles/styled';
import { Touchable } from './Touchable';

type Props = {
  children: string;
  disabled?: boolean;
  onEditStart?: () => void;
  onEditDone: (value: string) => void;
};

export function EditableText({
  children,
  disabled,
  onEditStart,
  onEditDone,
}: Props) {
  const [isEditing, setEditing] = useState(false);

  function startEditing() {
    setEditing(true);
    onEditStart?.();
  }

  function stopEditing(value: string) {
    onEditDone(value);
    setEditing(false);
  }

  if (!isEditing) {
    return (
      <TextButton
        disabled={disabled}
        className="editable-text-button"
        onPress={startEditing}
      >
        {children}
      </TextButton>
    );
  }

  return (
    <TextInput
      defaultValue={children}
      onBlur={(event) => {
        stopEditing(event.currentTarget.value);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          stopEditing(event.currentTarget.value);
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
  const keyboardThreshold = window.innerHeight * 0.6;

  function onFocus(event: FocusEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    if (!input) return;

    const position = input.getBoundingClientRect();
    const maybeUnderKeyboard = position.bottom > keyboardThreshold;

    // NOTE: We need to wait for the keyboard to show up before scrolling
    // to the input, otherwise the keyboard will cover the input
    setTimeout(() => {
      if (maybeUnderKeyboard) {
        input.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }

  return (
    <Input
      className="editable-text-input"
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
  textAlign: 'left',
  height: '100%',
  width: '100%',
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
  height: '100%',
});
