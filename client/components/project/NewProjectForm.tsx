import { ChangeEvent, FormEvent, useState } from 'react';

import { styled } from '~/styles/styled';
import { Button, Stack, Text, TextInput } from '~/components/uikit';

type Props = {
  isLoading: boolean;
  error?: string;
  onSubmit: (state: { name: string; password: string }) => void;
};

export function NewProjectForm({ isLoading, error, onSubmit }: Props) {
  const [state, setState] = useState({
    name: '',
    password1: '',
    password2: '',
    passwordsMatch: undefined as boolean | undefined,
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state.password1 !== state.password2) {
      setState((p) => ({ ...p, passwordsMatch: false }));
      return;
    }

    onSubmit({
      name: state.name.trim(),
      password: state.password1.trim(),
    });
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setState((p) => ({ ...p, [name]: value, passwordsMatch: undefined }));
  }

  return (
    <Form onSubmit={handleSubmit}>
      <TextInput
        label="Projektin nimi"
        name="name"
        value={state.name}
        onChange={handleChange}
      />

      <TextInput
        label="Salasana"
        type="password"
        message="Vähintään 8 merkkiä"
        minLength={8}
        name="password1"
        value={state.password1}
        onChange={handleChange}
      />

      <TextInput
        label="Salasana uudelleen"
        type="password"
        minLength={8}
        name="password2"
        value={state.password2}
        onChange={handleChange}
        message={
          state.passwordsMatch === false ? 'Salasanat eivät täsmää!' : undefined
        }
      />

      <Button type="submit" fullWidth icon="plusCircle">
        {isLoading ? 'Luodaan...' : 'Luo projekti'}
      </Button>

      {error === 'CONFLICT' && (
        <Stack direction="y" spacing="xsmall">
          <Text variant="bodySmallBold" color="textMuted" align="center">
            Samanniminen projekti on jo olemassa.
          </Text>
        </Stack>
      )}
    </Form>
  );
}

const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$regular',
});
