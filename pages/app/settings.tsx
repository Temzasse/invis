import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import toast from 'react-hot-toast';

import { api } from '~/utils/api';
import { withApiSession } from '~/server/api/root';
import { styled } from '~/styles/styled';
import {
  Button,
  Icon,
  IconButton,
  Spinner,
  Stack,
  Text,
  Touchable,
} from '~/components/uikit';
import { Navbar } from '~/components/navigation/Navbar';
import { AddProjectSheet } from '~/components/project/AddProjectSheet';

export const getServerSideProps = withApiSession(async (_, api) => {
  await Promise.all([
    api.project.getCurrentProject.prefetch(),
    api.project.getJoinedProjects.prefetch(),
  ]);
});

export default function Settings() {
  const [isAddProjectSheetOpen, setIsAddProjectSheetOpen] = useState(false);
  const switchProjectMutation = api.project.switchCurrentProject.useMutation();
  const { data: currentProject } = api.project.getCurrentProject.useQuery();
  const { data: joinedProjects = [] } = api.project.getJoinedProjects.useQuery(); // prettier-ignore
  const apiUtils = api.useUtils();

  console.log({ currentProject, joinedProjects });

  function copyProjectLink(projectName: string) {
    navigator.clipboard.writeText(
      `${window.location.origin}/login?name=${projectName}`
    );

    toast.success('Liittymislinkki kopioitu leikepöydälle', {
      position: 'top-center',
    });
  }

  function switchProject(projectId: string) {
    if (currentProject?.id !== projectId) {
      switchProjectMutation.mutate(
        { id: projectId },
        {
          onSuccess: async () => {
            // Invalidate all queries so that we don't show old data
            await apiUtils.invalidate();
          },
          onError: () => {
            toast.error('Projektin vaihtaminen epäonnistui');
          },
        }
      );
    }
  }

  return (
    <>
      <Head>
        <title>Asetukset</title>
      </Head>

      <Navbar title="Asetukset" />

      <Content>
        <Stack direction="y" spacing="regular">
          <SettingsGroup>
            <SettingsGroupTitle>
              <Text variant="overline" color="textMuted">
                Projektit
              </Text>
            </SettingsGroupTitle>

            {joinedProjects.map((project) => {
              const isCurrentProject = project.id === currentProject?.id;
              const isSwitchingTo =
                switchProjectMutation.isLoading &&
                switchProjectMutation.variables?.id === project.id;

              return (
                <SettingsGroupRow key={project.id}>
                  <Stack
                    direction="x"
                    spacing="regular"
                    justify="between"
                    align="center"
                  >
                    <Touchable
                      onPress={() => switchProject(project.id)}
                      disabled={switchProjectMutation.isLoading}
                    >
                      <Stack direction="x" spacing="xsmall" align="center">
                        {joinedProjects.length > 1 && isCurrentProject && (
                          <Icon name="checkOutline" size={20} color="primary" />
                        )}
                        {isSwitchingTo && <Spinner size="small" />}
                        <ProjectName variant="body">{project.name}</ProjectName>
                      </Stack>
                    </Touchable>

                    <IconButton
                      size={18}
                      icon="share"
                      onPress={() => copyProjectLink(project.name)}
                    />
                  </Stack>
                </SettingsGroupRow>
              );
            })}

            <SettingsGroupRow>
              <Button
                fullWidth
                icon="plusCircle"
                onPress={() => setIsAddProjectSheetOpen(true)}
              >
                Lisää projekti
              </Button>
            </SettingsGroupRow>
          </SettingsGroup>
        </Stack>
      </Content>

      <Logout>
        <Link href="/api/logout" passHref legacyBehavior>
          <Button asLink variant="outlined">
            Kirjaudu ulos
          </Button>
        </Link>
      </Logout>

      <AddProjectSheet
        isOpen={isAddProjectSheetOpen}
        onClose={() => setIsAddProjectSheetOpen(false)}
      />
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

const SettingsGroupTitle = styled('div', {
  paddingHorizontal: '$regular',
  paddingTop: '$xxsmall',
  marginBottom: '-4px', // hacky but looks better :D
});

const SettingsGroupRow = styled('div', {
  padding: '$regular',
  borderBottom: '1px solid $surface2',

  '&:last-child': {
    borderBottom: 'none',
  },
});

const ProjectName = styled(Text, {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
});

const Logout = styled('div', {
  padding: '$regular',
});
