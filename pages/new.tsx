import Head from 'next/head';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

import { api } from '~/utils/api';
import { styled } from '~/styles/styled';
import { Icon, Stack, Text } from '~/components/uikit';
import { Navbar } from '~/components/navigation/Navbar';
import { NewProjectForm } from '~/components/project/NewProjectForm';

export default function NewProject() {
  const router = useRouter();
  const mutation = api.project.createProject.useMutation();

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
      console.log('> Failed to create project', error);
      toast.error('Projektin luominen epäonnistui');
    }
  }

  return (
    <>
      <Head>
        <title>Invis | Uusi projekti</title>
      </Head>

      <Main>
        <Navbar title="Uusi projekti" />

        <Content>
          <NewProjectForm
            onSubmit={handleSubmit}
            isLoading={mutation.isLoading}
            error={mutation.error?.data?.code}
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
