import type { InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { withProject } from '~api/utils/redirect';
import { styled } from '~styles/styled';
import { Button } from '~components/uikit';
import Navbar from '~components/navigation/Navbar';

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Settings({ project }: Props) {
  function copyProjectLink() {
    // TODO: add toast message
    navigator.clipboard.writeText(
      `${window.location.origin}/join?name=${project.name}&pin=${project.pin}`
    );
  }

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

            <ProjectDetailLabel>PIN-koodi</ProjectDetailLabel>
            <ProjectDetail>{project.pin}</ProjectDetail>
          </ProjectDetails>

          <CopyProjectLink>
            <Button fullWidth icon="share" onPress={copyProjectLink}>
              Kopioi liittymislinkki
            </Button>
          </CopyProjectLink>
        </SettingsGroup>
      </Content>

      <Logout>
        <Link href="/api/logout" passHref>
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

export const getServerSideProps = withProject(async (_, project) => {
  return { props: { project } };
});
