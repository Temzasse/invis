import { useState } from 'react';
import toast from 'react-hot-toast';

import { api } from '~/utils/api';
import { styled } from '~/styles/styled';
import { BottomSheet, SegmentedControl } from '~/components/uikit';
import { NewProjectForm } from './NewProjectForm';
import { JoinProjectForm } from './JoinProjectForm';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function AddProjectSheet({ isOpen, onClose }: Props) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <AddProjectFormTabs onClose={onClose} />
    </BottomSheet>
  );
}

function AddProjectFormTabs({ onClose }: { onClose: Props['onClose'] }) {
  const [selectedTab, setSelectedTab] = useState<'add' | 'join'>('add');
  const apiUtils = api.useUtils();
  const joinProject = api.project.joinProject.useMutation();
  const createProject = api.project.createProject.useMutation();

  async function handleSuccess() {
    // Invalidate all queries so that we don't show old data
    await apiUtils.invalidate();
    onClose();
  }

  function handleNewProjectSubmit({
    name,
    password,
  }: {
    name: string;
    password: string;
  }) {
    createProject.mutate(
      { name, password },
      {
        onSuccess: handleSuccess,
        onError: () => {
          toast.error('Projektin luominen epäonnistui');
        },
      }
    );
  }

  function handleJoinProjectSubmit({
    name,
    password,
  }: {
    name: string;
    password: string;
  }) {
    joinProject.mutate(
      { name, password },
      {
        onSuccess: handleSuccess,
        onError: () => {
          toast.error('Projektiin liittyminen epäonnistui');
        },
      }
    );
  }

  return (
    <Wrapper>
      <SegmentedControl
        selected={selectedTab}
        onSelect={setSelectedTab}
        segments={[
          { label: 'Uusi projekti', value: 'add' },
          { label: 'Liity projektiin', value: 'join' },
        ]}
      />

      <Content>
        {selectedTab === 'add' ? (
          <NewProjectForm
            onSubmit={handleNewProjectSubmit}
            isLoading={createProject.isLoading}
            error={createProject.error?.data?.code}
          />
        ) : (
          <JoinProjectForm
            onSubmit={handleJoinProjectSubmit}
            isLoading={joinProject.isLoading}
            isError={joinProject.isError}
          />
        )}
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  height: '100%',
});

const Content = styled('div', {
  paddingTop: '$medium',
});
