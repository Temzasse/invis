import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { api } from '~/utils/api';
import { styled } from '~/styles/styled';
import { Icon, Stack, Text } from '~/components/uikit';
import { Navbar } from '~/components/navigation/Navbar';
import { JoinProjectForm } from '~/components/project/JoinProjectForm';

export default function Login() {
  const router = useRouter();
  const initialName =
    typeof router.query.name === 'string' ? router.query.name : undefined;
  const mutation = api.project.joinProject.useMutation();

  async function handleSubmit({
    name,
    password,
  }: {
    name: string;
    password: string;
  }) {
    try {
      await mutation.mutateAsync({ name, password });
      router.replace('/app/home');
    } catch (error) {
      console.log('> Failed to login', error);
    }
  }

  useEffect(() => {
    if (typeof initialName === 'string') {
      const passwordInput = document.querySelector<HTMLInputElement>(
        'input[type="password"]'
      );

      passwordInput?.focus();
    }
  }, [initialName]);

  return (
    <>
      <Head>
        <title>Invis | Kirjaudu sisään</title>
      </Head>

      <Main>
        <Navbar title="Liity projektiin" />

        <Content>
          <JoinProjectForm
            initialName={initialName}
            onSubmit={handleSubmit}
            isLoading={mutation.isLoading}
            isError={mutation.isError}
          />
        </Content>

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

const Content = styled('div', {
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
