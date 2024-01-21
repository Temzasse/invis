import { ChangeEvent, FormEvent, useState } from 'react';

import { styled } from '~/styles/styled';
import { Button, Stack, Text, TextInput } from '~/components/uikit';

type Props = {
  isLoading: boolean;
  isError?: boolean;
  initialName?: string;
  onSubmit: (state: { name: string; password: string }) => void;
};

export function JoinProjectForm({
  initialName,
  isLoading,
  isError,
  onSubmit,
}: Props) {
  const [state, setState] = useState({
    name: initialName || '',
    password: '',
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      name: state.name.trim(),
      password: state.password.trim(),
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
        type="password"
        label="Salasana"
        name="password"
        minLength={8}
        value={state.password}
        onChange={handleChange}
        autoComplete="current-password"
      />

      <Button type="submit" fullWidth icon="arrowRight">
        {isLoading ? 'Kirjaudutaan...' : 'Kirjaudu sisään'}
      </Button>

      {!!isError && (
        <Stack direction="y" spacing="xsmall">
          <Text variant="bodySmallBold" color="textMuted" align="center">
            Kirjautuminen epäonnistui!
          </Text>
          <Text variant="bodySmall" color="textMuted" align="center">
            Tarkista projektin nimi ja salasana.
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
