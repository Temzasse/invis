import Head from 'next/head';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/router';

import { api } from '~utils/api';
import { styled } from '~styles/styled';
import { Button } from '~components/uikit';
import Navbar from '~components/navigation/Navbar';

export default function Login() {
  const [credentials, setCredentials] = useState({ name: '', pin: '' });
  const router = useRouter();
  const mutation = api.project.joinProject.useMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await mutation.mutateAsync({
        name: credentials.name.trim(),
        pin: credentials.pin.trim(),
      });

      router.replace('/app/home');
    } catch (error) {
      console.log('> Failed to login', error);
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setCredentials((p) => ({ ...p, [name]: value }));
  }

  return (
    <>
      <Head>
        <title>Invis | Kirjaudu sisään</title>
      </Head>

      <main>
        <Navbar title="Kirjaudu sisään" />

        <Form onSubmit={handleSubmit}>
          <Label>
            <span>Projektin nimi</span>
            <TextInput
              type="text"
              name="name"
              value={credentials.name}
              onChange={handleChange}
            />
          </Label>

          <Label>
            <span>PIN-koodi</span>
            <TextInput
              type="text"
              name="pin"
              maxLength={6}
              value={credentials.pin}
              onChange={handleChange}
            />
          </Label>

          <Button type="submit" fullWidth>
            {mutation.isLoading ? 'Kirjaudutaan...' : 'Kirjaudu sisään'}
          </Button>
        </Form>
      </main>
    </>
  );
}

const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$small',
  padding: '$regular',
});

const Label = styled('label', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$xxsmall',
  color: '$text',
});

const TextInput = styled('input', {
  padding: '$small $regular',
  backgroundColor: '$background',
  color: '$text',
  border: '1px solid $border',
  borderRadius: '$medium',
  outline: 'none',
});
