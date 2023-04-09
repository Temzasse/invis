import { styled } from '~styles/styled';
import { Text } from '~components/uikit';

export default function InstallationGuide() {
  return (
    <Wrapper>
      <Text variant="body">Installation guide</Text>
    </Wrapper>
  );
}

const Wrapper = styled('div', {
  safeAreaInsets: 'padding',
});
