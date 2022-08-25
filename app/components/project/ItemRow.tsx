import { Stack, Text } from '~components/uikit';
import { styled } from '~styles/styled';
import { ItemStatusIndicator, ItemStatus } from './ItemStatus';

type Props = {
  status: ItemStatus;
  name: string;
};

export default function ItemRow({ status, name }: Props) {
  return (
    <Wrapper direction="x" spacing="regular" align="center">
      <ItemStatusIndicator status={status} />
      <Text variant="body">{name}</Text>
    </Wrapper>
  );
}

const Wrapper = styled(Stack, {
  width: '100%',
  padding: '$regular',
});
