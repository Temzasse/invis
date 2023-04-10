import Head from 'next/head';
import Link from 'next/link';

import { api } from '~utils/api';
import { withApiSession } from '~server/api/root';
import { styled } from '~styles/styled';
import { Button } from '~components/uikit';
import Navbar from '~components/navigation/Navbar';

export const getServerSideProps = withApiSession(async (_, api) => {
  await api.project.getProject.prefetch();
});

export default function Settings() {
  const { data: project } = api.project.getProject.useQuery();

  function copyProjectLink() {
    // TODO: add toast message
    navigator.clipboard.writeText(
      `${window.location.origin}/login?name=${project?.name}`
    );
  }

  if (!project) return null;

  return (
    <>
      <Head>
        <title>Asetukset</title>
      </Head>

      <Navbar title="Asetukset" />

      <Content>
        <SettingsGroup>
          <ProjectDetails>
            <ProjectDetailLabel>Projektin nimi</ProjectDetailLabel>
            <ProjectDetail>{project.name}</ProjectDetail>
          </ProjectDetails>

          <CopyProjectLink>
            <Button fullWidth icon="share" onPress={copyProjectLink}>
              Kopioi liittymislinkki
            </Button>
          </CopyProjectLink>
        </SettingsGroup>
      </Content>

      <Logout>
        <Link href="/api/logout" passHref legacyBehavior>
          <Button asLink variant="outlined">
            Kirjaudu ulos
          </Button>
        </Link>
      </Logout>
    </>
  );
}

const Content = styled('main', {
  flex: 1,
  paddingHorizontal: '$regular',
});

const SettingsGroup = styled('div', {
  backgroundColor: '$surface2',
  borderRadius: '$medium',
});

const ProjectDetails = styled('dl', {
  display: 'flex',
  flexWrap: 'wrap',
  'dt, dd': {
    borderBottom: '1px solid $surface2',
  },
});

const ProjectDetailLabel = styled('dt', {
  flexBasis: '33.33%',
  marginLeft: '$regular',
  paddingVertical: '$regular',
  typography: '$body',
  color: '$text',
});

const ProjectDetail = styled('dd', {
  flexBasis: 'calc(66.66% - $space$regular)',
  padding: '$regular',
  textAlign: 'right',
  typography: '$body',
  color: '$textMuted',
});

const CopyProjectLink = styled('div', {
  padding: '$regular',
});

const Logout = styled('div', {
  padding: '$regular',
});
