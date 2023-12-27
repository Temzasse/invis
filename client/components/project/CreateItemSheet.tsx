import { FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';

import {
  Button,
  BottomSheet,
  TextInput,
  Select,
  Stack,
  Text,
  Icon,
} from '~/components/uikit';

import { api } from '~/utils/api';
import { styled } from '~/styles/styled';
import { highlightElement } from './utils';
import { ItemStatus } from './ItemStatus';
import ItemStatusButton from './ItemStatusButton';

type Props = {
  isOpen: boolean;
  categoryId?: string;
  onClose: () => void;
};

export function CreateItemSheet({ isOpen, categoryId, onClose }: Props) {
  const { data: categories = [] } = api.category.getCategories.useQuery(
    undefined,
    { enabled: !categoryId }
  );

  const categoryOptions = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <CreateItemForm
        categoryId={categoryId}
        categoryOptions={categoryOptions}
        onCreated={onClose}
      />
    </BottomSheet>
  );
}

function CreateItemForm({
  categoryId,
  categoryOptions,
  onCreated,
}: {
  categoryId?: string;
  categoryOptions: { id: string; name: string }[];
  onCreated: () => void;
}) {
  const [category, setCategory] = useState(categoryId || categoryOptions[0].id);
  const [name, setName] = useState('');
  const [status, setStatus] = useState<ItemStatus>('missing');
  const apiUtils = api.useContext();
  const { mutate, error, isLoading } =
    api.category.addItemToCategory.useMutation();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading || !category || !name) return;

    mutate(
      { categoryId: category, name, status },
      {
        onSuccess: async ({ id }) => {
          onCreated();
          await apiUtils.category.getCategoriesWithItems.invalidate();
          await apiUtils.category.getCategory.invalidate();
          highlightElement(id);
          toast.success(`${name} lisätty!`, { position: 'bottom-center' });
        },
      }
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Content direction="y" spacing="medium">
        {!categoryId && (
          <Select
            label="Valitse kategoria"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        )}

        <TextInput
          label="Anna nimi"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus={Boolean(categoryId)}
        />

        <Stack direction="y" spacing="small">
          <Text variant="body">Valitse määrä</Text>
          <Stack direction="x" spacing="medium">
            <ItemStatusButton
              status="missing"
              isActive={status === 'missing'}
              onPress={() => setStatus('missing')}
            />
            <ItemStatusButton
              status="partial"
              isActive={status === 'partial'}
              onPress={() => setStatus('partial')}
            />
            <ItemStatusButton
              status="full"
              isActive={status === 'full'}
              onPress={() => setStatus('full')}
            />
            T
          </Stack>
        </Stack>

        {error?.message.toLowerCase().includes('unique constraint') && (
          <ErrorCard>
            <Stack direction="x" spacing="small">
              <Icon name="infoCircle" color="textMuted" />
              <Text variant="body" color="textMuted" withLineHeight>
                <b>{name}</b> on jo olemassa kategoriassa{' '}
                <b>{categoryOptions.find((c) => c.id === category)?.name}</b>!
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
