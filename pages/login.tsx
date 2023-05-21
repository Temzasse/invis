import Head from 'next/head';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import { api } from '~utils/api';
import { styled } from '~styles/styled';
import { Button, Icon, Stack, Text, TextInput } from '~components/uikit';
import Navbar from '~components/navigation/Navbar';

export default function Login() {
  const router = useRouter();
  const initialName = router.query.name;
  const mutation = api.project.joinProject.useMutation();
  const [credentials, setCredentials] = useState({ name: '', password: '' });
  const passwordInput = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await mutation.mutateAsync({
        name: credentials.name.trim(),
        password: credentials.password.trim(),
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

  useEffect(() => {
    if (typeof initialName === 'string' && credentials.name === '') {
      setCredentials((p) => ({ ...p, name: initialName }));
      passwordInput.current?.focus();
    }
  }, [initialName, credentials.name]);

  return (
    <>
      <Head>
        <title>Invis | Kirjaudu sisään</title>
      </Head>

      <Main>
        <Navbar title="Kirjaudu sisään" />

        <Form onSubmit={handleSubmit}>
          <TextInput
            label="Projektin nimi"
            name="name"
            value={credentials.name}
            onChange={handleChange}
          />

          <TextInput
            ref={passwordInput}
            type="password"
            label="Salasana"
            name="password"
            minLength={8}
            value={credentials.password}
            onChange={handleChange}
            autoComplete="current-password"
          />

          <Button type="submit" fullWidth icon="arrowRight">
            {mutation.isLoading ? 'Kirjaudutaan...' : 'Kirjaudu sisään'}
          </Button>

          {mutation.isError && (
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

        <Footer>
          <Link href="/">
            <Stack direction="x" spacing="xxsmall" align="center">
              <Icon name="arrowLeft" size={16} color="text" />
              <Text variant="body">Takaisin etusivulle</Text>
            </Stack>
          </Link>
        </Footer>
      </Main>
    </>
  );
}

const Main = styled('main', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$regular',
  padding: '$regular',
});

const Footer = styled('footer', {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: '$background',
  marginBottom: 'env(safe-area-inset-bottom)',
  padding: '$regular',
});
