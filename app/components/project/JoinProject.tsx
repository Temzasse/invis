import { styled } from '~styles/styled';
import { Text } from '~components/uikit';

export default function JoinProject() {
  return (
    <Wrapper>
      <Text variant="body">Join project</Text>
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  safeAreaInsets: 'padding',
});
