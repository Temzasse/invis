import Head from 'next/head';
import { useRouter } from 'next/router';

import { api } from '~utils/api';
import { styled } from '~styles/styled';

export default function NewProject() {
  const router = useRouter();
  const mutation = api.project.createProject.useMutation();

  async function handleCreate() {
    try {
      await mutation.mutateAsync({ name: 'Test', pin: '123456' });
      router.replace('/app/home');
    } catch (error) {
      console.log('> Failed to create project', error);
    }
  }

  return (
    <>
      <Head>
        <title>Invis | New project</title>
      </Head>

      <Main>
        <button onClick={handleCreate} style={{ color: '#fff' }}>
          {mutation.isLoading ? 'Loading...' : 'Create'}
        </button>
      </Main>
    </>
  );
}

const Main = styled('main', {
  height: '100%',
});
