import { FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';

import {
  Button,
  BottomSheet,
  TextInput,
  Stack,
  Text,
  Icon,
} from '~/components/uikit';

import { api } from '~/utils/api';
import { styled } from '~/styles/styled';
import { highlightElement } from './utils';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreateCategorySheet({ isOpen, onClose }: Props) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <CreateCategoryForm onCreated={onClose} />
    </BottomSheet>
  );
}

function CreateCategoryForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState('');
  const apiUtils = api.useContext();
  const { mutate, error, isLoading } =
    api.category.createCategory.useMutation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading || !name) return;

    mutate(
      { name },
      {
        onSuccess: async ({ id }) => {
          onCreated();
          await apiUtils.category.getCategories.invalidate();
          highlightElement(id);
          toast.success(`${name} kategoria lisätty!`, {
            position: 'bottom-center',
          });
        },
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Content direction="y" spacing="medium">
        <TextInput
          label="Anna kategorian nimi"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {error?.message.toLowerCase().includes('unique constraint') && (
          <ErrorCard>
            <Stack direction="x" spacing="small">
              <Icon name="infoCircle" color="textMuted" />
              <Text variant="body" color="textMuted" withLineHeight>
                <b>{name}</b> on jo olemassa kategoriassa!
              </Text>
            </Stack>
          </ErrorCard>
        )}

        <Button type="submit" fullWidth isLoading={isLoading}>
          {isLoading ? 'Luodaan...' : 'Luo'}
        </Button>
      </Content>
    </Form>
  );
}

const Form = styled('form', {
  height: '100%',
});

const Content = styled(Stack, {
  height: '100%',
});

const ErrorCard = styled('div', {
  padding: '$regular',
  backgroundColor: '$surface2',
  borderRadius: '$regular',
});
