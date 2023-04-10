import Head from 'next/head';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/router';

import { api } from '~utils/api';
import { styled } from '~styles/styled';
import { Button, Icon, Stack, Text, TextInput } from '~components/uikit';
import Navbar from '~components/navigation/Navbar';

export default function NewProject() {
  const [state, setState] = useState({
    name: '',
    password1: '',
    password2: '',
    passwordsMatch: undefined as boolean | undefined,
  });

  const router = useRouter();
  const mutation = api.project.createProject.useMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state.password1 !== state.password2) {
      setState((p) => ({ ...p, passwordsMatch: false }));
      return;
    }

    try {
      await mutation.mutateAsync({
        name: state.name.trim(),
        password: state.password1.trim(),
      });

      router.replace('/app/home');
    } catch (error) {
      console.log('> Failed to create project', error);
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setState((p) => ({ ...p, [name]: value, passwordsMatch: undefined }));
  }

  return (
    <>
      <Head>
        <title>Invis | Uusi projekti</title>
      </Head>

      <Main>
        <Navbar title="Uusi projekti" />

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
              state.passwordsMatch === false
                ? 'Salasanat eivät täsmää!'
                : undefined
            }
          />

          <Button type="submit" fullWidth icon="plusCircle">
            {mutation.isLoading ? 'Luodaan...' : 'Luo projekti'}
          </Button>

          {mutation.error?.data?.code === 'CONFLICT' && (
            <Stack direction="y" spacing="xsmall">
              <Text variant="bodySmallBold" color="textMuted" align="center">
                Samanniminen projekti on jo olemassa.
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
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: '$background',
  marginBottom: 'env(safe-area-inset-bottom)',
  padding: '$regular',
});
